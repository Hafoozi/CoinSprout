export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase/service'

const MIN_INTEREST_PAYOUT = 0.05

/**
 * Daily cron job — processes interest first, then allowances.
 *
 * Payment logic: pay if it has been ≥6 days since the last payment (or never
 * paid). This replaces the old day_of_week exact-match which silently skipped
 * payments whenever the UTC day didn't align or Vercel missed a fire.
 *
 * The 6-day window (not 7) gives a one-day grace buffer so a cron that fires
 * slightly early never skips a week.
 *
 * Still prevents double-paying on the same calendar day via todayStr check.
 * Protected by CRON_SECRET header set automatically by Vercel.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase  = createServiceClient()
  const today     = new Date()
  const todayStr  = today.toISOString().slice(0, 10) // 'YYYY-MM-DD'

  // A record is due if it has never been paid, or last paid ≥6 days ago.
  function isDue(lastPromptedAt: string | null): boolean {
    if (!lastPromptedAt) return true
    if (lastPromptedAt.slice(0, 10) === todayStr) return false // already ran today
    const daysSince = (today.getTime() - new Date(lastPromptedAt).getTime()) / 86_400_000
    return daysSince >= 6
  }

  // ── 1. Process interest (before allowance so balance is correct) ──────────

  const { data: interestRows, error: interestFetchError } = await supabase
    .from('recurring_interest')
    .select()
    .eq('is_active', true)

  if (interestFetchError) {
    console.error('[cron/allowance] interest fetch error:', interestFetchError)
    return Response.json({ ok: false, error: interestFetchError.message }, { status: 500 })
  }

  let interestProcessed = 0
  let interestSkipped   = 0

  for (const interest of (interestRows ?? [])) {
    if (!isDue(interest.last_prompted_at)) {
      interestSkipped++
      continue
    }

    const { data: txRows } = await supabase
      .from('transactions')
      .select('amount')
      .eq('child_id', interest.child_id)

    const balance = (txRows ?? []).reduce((sum: number, t: { amount: number }) => sum + t.amount, 0)

    if (balance <= 0) {
      interestSkipped++
      continue
    }

    const rawInterest = Math.round((balance * (interest.rate / 100)) * 100) / 100
    const amount = Math.max(MIN_INTEREST_PAYOUT, rawInterest)

    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        child_id: interest.child_id,
        amount,
        source:   'interest',
        note:     `${interest.rate}% weekly interest`,
      })

    if (txError) {
      console.error(`[cron/allowance] interest tx error for child ${interest.child_id}:`, txError)
      continue
    }

    await supabase
      .from('recurring_interest')
      .update({ last_prompted_at: today.toISOString() })
      .eq('child_id', interest.child_id)

    interestProcessed++
  }

  // ── 2. Process allowances ─────────────────────────────────────────────────

  const { data: allowances, error: fetchError } = await supabase
    .from('recurring_allowances')
    .select()
    .eq('is_active', true)

  if (fetchError) {
    console.error('[cron/allowance] allowance fetch error:', fetchError)
    return Response.json({ ok: false, error: fetchError.message }, { status: 500 })
  }

  let processed = 0
  let skipped   = 0

  for (const allowance of (allowances ?? [])) {
    if (!isDue(allowance.last_prompted_at)) {
      skipped++
      continue
    }

    const payoutAmount = allowance.next_amount_override ?? allowance.amount

    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        child_id: allowance.child_id,
        amount:   payoutAmount,
        source:   'allowance',
        note:     'Weekly allowance',
      })

    if (txError) {
      console.error(`[cron/allowance] allowance tx error for child ${allowance.child_id}:`, txError)
      continue
    }

    await supabase
      .from('recurring_allowances')
      .update({ last_prompted_at: today.toISOString(), next_amount_override: null })
      .eq('child_id', allowance.child_id)

    processed++
  }

  return Response.json({
    ok: true,
    interest: { processed: interestProcessed, skipped: interestSkipped },
    allowance: { processed, skipped },
  })
}
