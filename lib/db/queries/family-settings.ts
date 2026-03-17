import { createClient } from '@/lib/supabase/server'
import type { FamilySettings } from '@/lib/db/types'

export async function getFamilySettings(familyId: string): Promise<FamilySettings | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('family_settings')
    .select()
    .eq('family_id', familyId)
    .single()
  return data ?? null
}
