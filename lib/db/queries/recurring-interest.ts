import { createClient } from '@/lib/supabase/server'
import type { RecurringInterest } from '@/lib/db/types'

export async function getRecurringInterestByChildId(
  childId: string
): Promise<RecurringInterest | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('recurring_interest')
    .select()
    .eq('child_id', childId)
    .maybeSingle()
  return data ?? null
}
