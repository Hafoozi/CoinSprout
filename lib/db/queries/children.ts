import { createClient } from '@/lib/supabase/server'
import type { Child } from '@/lib/db/types'

/** Fetch all children belonging to a family, ordered by creation date. */
export async function getChildrenByFamilyId(familyId: string): Promise<Child[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('children')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at')
  return data ?? []
}

/** Fetch a single child by ID. RLS ensures the child belongs to the caller's family. */
export async function getChildById(childId: string): Promise<Child | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('children')
    .select('*')
    .eq('id', childId)
    .single()
  return data ?? null
}
