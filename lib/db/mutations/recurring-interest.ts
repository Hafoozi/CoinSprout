import { createClient } from '@/lib/supabase/server'
import type { RecurringInterest } from '@/lib/db/types'

export async function upsertRecurringInterest(data: {
  childId:    string
  rate:       number
  dayOfWeek:  number
  isActive:   boolean
}): Promise<RecurringInterest | null> {
  const supabase = await createClient()
  const { data: result } = await supabase
    .from('recurring_interest')
    .upsert(
      {
        child_id:    data.childId,
        rate:        data.rate,
        day_of_week: data.dayOfWeek,
        is_active:   data.isActive,
      },
      { onConflict: 'child_id' }
    )
    .select()
    .single()
  return result ?? null
}

export async function updateInterestLastPromptedAt(
  childId: string,
  at: string | null
): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('recurring_interest')
    .update({ last_prompted_at: at })
    .eq('child_id', childId)
}
