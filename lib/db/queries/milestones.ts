import { createClient } from '@/lib/supabase/server'
import type { Milestone } from '@/lib/db/types'

/** Fetch all unlocked milestones for a child, ordered by unlock time. */
export async function getMilestonesByChildId(childId: string): Promise<Milestone[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('milestones')
    .select('*')
    .eq('child_id', childId)
    .order('unlocked_at')
  return data ?? []
}
