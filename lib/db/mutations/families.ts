import { createClient } from '@/lib/supabase/server'
import type { Family } from '@/lib/db/types'

/** Update the parent PIN hash on the family row. */
export async function updateFamilyPin(familyId: string, pinHash: string): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('families')
    .update({ parent_pin_hash: pinHash })
    .eq('id', familyId)
}

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
