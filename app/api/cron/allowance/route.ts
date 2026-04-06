export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase/service'
import { addDaysToDate, todayUTC } from '@/lib/utils/payment-date'

const MIN_INTEREST_PAYOUT = 0.05

/**
 * Daily cron job — processes interest first, then allowances.
 *
 * A record is due when its next_payment_date <= today (UTC), or is null
 * (legacy records that pre-date migration 014 — pay immediately and set
 * the date going forward).
 *
 * After paying: next_payment_date advances by exactly 7 days so the schedule
 * is stable and never drifts regardless of when the cron fires.
 *
 * Protected by CRON_SECRET header set automatically by Vercel.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createServiceClient()
  const today    = todayUTC()

  // ── 1. Process interest (before allowance so balance is correct) ──────────

  const { data: interestRows, error: interestFetchError } = await supabase
    .from('recurring_interest')
    .select()
    .eq('is_active', true)

  if (interestFetchError) {
    console.error('[cron] interest fetch error:', interestFetchError)
    return Response.json({ ok: false, error: interestFetchError.message }, { status: 500 })
  }

  let interestProcessed = 0
  let interestSkipped   = 0

  for (const interest of (interestRows ?? [])) {
    const due = !interest.next_payment_date || interest.next_payment_date <= today
    if (!due) { interestSkipped++; continue }

    const { data: txRows } = await supabase
      .from('transactions')
      .select('amount')
      .eq('child_id', interest.child_id)

    const balance = (txRows ?? []).reduce((sum: number, t: { amount: number }) => sum + t.amount, 0)

    if (balance <= 0) { interestSkipped++; continue }

    const rawInterest = Math.round((balance * (interest.rate / 100)) * 100) / 100
    const amount      = Math.max(MIN_INTEREST_PAYOUT, rawInterest)

    const { error: txError } = await supabase.from('transactions').insert({
      child_id: interest.child_id,
      amount,
      source:   'interest',
      note:     `${interest.rate}% weekly interest`,
    })

    if (txError) {
      console.error(`[cron] interest tx error for child ${interest.child_id}:`, txError)
      continue
    }

    const nextDate = addDaysToDate(interest.next_payment_date ?? today, 7)
    await supabase
      .from('recurring_interest')
      .update({ last_prompted_at: new Date().toISOString(), next_payment_date: nextDate })
      .eq('child_id', interest.child_id)

    interestProcessed++
  }

  // ── 2. Process allowances ─────────────────────────────────────────────────

  const { data: allowances, error: fetchError } = await supabase
    .from('recurring_allowances')
    .select()
    .eq('is_active', true)

  if (fetchError) {
    console.error('[cron] allowance fetch error:', fetchError)
    return Response.json({ ok: false, error: fetchError.message }, { status: 500 })
  }

  let processed = 0
  let skipped   = 0

  for (const allowance of (allowances ?? [])) {
    const due = !allowance.next_payment_date || allowance.next_payment_date <= today
    if (!due) { skipped++; continue }

    const payoutAmount = allowance.next_amount_override ?? allowance.amount

    const { error: txError } = await supabase.from('transactions').insert({
      child_id: allowance.child_id,
      amount:   payoutAmount,
      source:   'allowance',
      note:     'Weekly allowance',
    })

    if (txError) {
      console.error(`[cron] allowance tx error for child ${allowance.child_id}:`, txError)
      continue
    }

    const nextDate = addDaysToDate(allowance.next_payment_date ?? today, 7)
    await supabase
      .from('recurring_allowances')
      .update({
        last_prompted_at:      new Date().toISOString(),
        next_amount_override:  null,
        next_payment_date:     nextDate,
      })
      .eq('child_id', allowance.child_id)

    processed++
  }

  return Response.json({
    ok: true,
    interest: { processed: interestProcessed, skipped: interestSkipped },
    allowance: { processed, skipped },
  })
}
