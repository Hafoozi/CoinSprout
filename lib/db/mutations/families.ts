import { createClient } from '@/lib/supabase/server'
import type { Family } from '@/lib/db/types'

/** Create a family row for a newly registered parent. */
export async function createFamily(userId: string): Promise<Family | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('families')
    .insert({ owner_user_id: userId })
    .select()
    .single()
  return data ?? null
}
