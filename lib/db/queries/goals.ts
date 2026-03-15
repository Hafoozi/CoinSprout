import { createClient } from '@/lib/supabase/server'
import type { Goal } from '@/lib/db/types'

/** Fetch all goals for a child, ordered oldest first. */
export async function getGoalsByChildId(childId: string): Promise<Goal[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('goals')
    .select('*')
    .eq('child_id', childId)
    .order('created_at')
  return data ?? []
}

/** Fetch a single goal by ID. RLS ensures it belongs to the caller's family. */
export async function getGoalById(goalId: string): Promise<Goal | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .single()
  return data ?? null
}
