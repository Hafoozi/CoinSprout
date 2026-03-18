import { createClient } from '@/lib/supabase/server'
import type { RecurringAllowance } from '@/lib/db/types'

export async function upsertRecurringAllowance(data: {
  childId:    string
  amount:     number
  dayOfWeek:  number
  hourOfDay:  number
  isActive:   boolean
}): Promise<RecurringAllowance | null> {
  const supabase = await createClient()
  const { data: result } = await supabase
    .from('recurring_allowances')
    .upsert(
      {
        child_id:    data.childId,
        amount:      data.amount,
        day_of_week: data.dayOfWeek,
        hour_of_day: data.hourOfDay,
        is_active:   data.isActive,
      },
      { onConflict: 'child_id' }
    )
    .select()
    .single()
  return result ?? null
}

export async function updateLastPromptedAt(
  childId: string,
  at: string | null
): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('recurring_allowances')
    .update({ last_prompted_at: at })
    .eq('child_id', childId)
}

export async function setNextAmountOverride(
  childId: string,
  override: number | null
): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('recurring_allowances')
    .update({ next_amount_override: override })
    .eq('child_id', childId)
}
