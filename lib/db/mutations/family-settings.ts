import { createClient } from '@/lib/supabase/server'
import type { FamilySettings } from '@/lib/db/types'

export async function upsertFamilySettings(data: {
  familyId:       string
  currencySymbol: string
}): Promise<FamilySettings | null> {
  const supabase = await createClient()
  const { data: result } = await supabase
    .from('family_settings')
    .upsert(
      {
        family_id:       data.familyId,
        currency_symbol: data.currencySymbol,
      },
      { onConflict: 'family_id' }
    )
    .select()
    .single()
  return result ?? null
}

export async function upsertFamilyQuickAccess(data: {
  familyId:            string
  quickAccessEnabled:  boolean
}): Promise<FamilySettings | null> {
  const supabase = await createClient()
  const { data: result } = await supabase
    .from('family_settings')
    .upsert(
      {
        family_id:            data.familyId,
        quick_access_enabled: data.quickAccessEnabled,
      },
      { onConflict: 'family_id' }
    )
    .select()
    .single()
  return result ?? null
}
