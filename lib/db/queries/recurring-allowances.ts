import { createClient } from '@/lib/supabase/server'
import type { RecurringAllowance } from '@/lib/db/types'

export async function getRecurringAllowanceByChildId(
  childId: string
): Promise<RecurringAllowance | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('recurring_allowances')
    .select()
    .eq('child_id', childId)
    .maybeSingle()
  return data ?? null
}

export async function getActiveAllowancesForDay(
  dayOfWeek: number
): Promise<RecurringAllowance[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('recurring_allowances')
    .select()
    .eq('is_active', true)
    .eq('day_of_week', dayOfWeek)
  return data ?? []
}
