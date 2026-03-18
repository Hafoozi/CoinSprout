export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase/service'

/**
 * Daily cron job — insert allowance transactions for all active recurring allowances
 * whose day_of_week matches today and haven't already run today.
 *
 * Protected by CRON_SECRET header set in vercel.json.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase  = createServiceClient()
  const today     = new Date()
  const dayOfWeek = today.getUTCDay()    // 0=Sun … 6=Sat (UTC)
  const hourOfDay = today.getUTCHours()  // 0–23 (UTC)
  const todayStr  = today.toISOString().slice(0, 10) // 'YYYY-MM-DD'

  // Fetch active allowances for today's day AND this UTC hour
  const { data: allowances, error: fetchError } = await supabase
    .from('recurring_allowances')
    .select()
    .eq('is_active', true)
    .eq('day_of_week', dayOfWeek)
    .eq('hour_of_day', hourOfDay)

  if (fetchError) {
    console.error('[cron/allowance] fetch error:', fetchError)
    return Response.json({ ok: false, error: fetchError.message }, { status: 500 })
  }

  if (!allowances || allowances.length === 0) {
    return Response.json({ ok: true, processed: 0 })
  }

  let processed = 0
  let skipped   = 0

  for (const allowance of allowances) {
    // Skip if already ran today
    const lastRun = allowance.last_prompted_at?.slice(0, 10)
    if (lastRun === todayStr) {
      skipped++
      continue
    }

    // Insert the allowance transaction
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        child_id: allowance.child_id,
        amount:   allowance.amount,
        source:   'allowance',
        note:     'Weekly allowance',
      })

    if (txError) {
      console.error(`[cron/allowance] tx insert error for child ${allowance.child_id}:`, txError)
      continue
    }

    // Update last_prompted_at
    await supabase
      .from('recurring_allowances')
      .update({ last_prompted_at: today.toISOString() })
      .eq('child_id', allowance.child_id)

    processed++
  }

  return Response.json({ ok: true, processed, skipped })
}
