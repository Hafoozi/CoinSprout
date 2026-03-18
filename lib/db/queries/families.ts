import { createClient } from '@/lib/supabase/server'
import type { Family } from '@/lib/db/types'

/** Fetch the family record owned by the given user (matched via RLS). */
export async function getFamilyByUserId(userId: string): Promise<Family | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('families')
    .select('*')
    .eq('owner_user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  return data ?? null
}
