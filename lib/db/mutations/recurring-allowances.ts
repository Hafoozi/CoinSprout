import { createClient } from '@/lib/supabase/server'
import type { RecurringAllowance } from '@/lib/db/types'

export async function upsertRecurringAllowance(data: {
  childId:   string
  amount:    number
  dayOfWeek: number
  isActive:  boolean
}): Promise<RecurringAllowance | null> {
  const supabase = await createClient()
  const { data: result } = await supabase
    .from('recurring_allowances')
    .upsert(
      {
        child_id:    data.childId,
        amount:      data.amount,
        day_of_week: data.dayOfWeek,
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
  at: string
): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('recurring_allowances')
    .update({ last_prompted_at: at })
    .eq('child_id', childId)
}
