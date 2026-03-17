import { createClient } from '@/lib/supabase/server'
import type { ChildSettings } from '@/lib/db/types'

/** Fetch custom settings for a child, or null if none have been saved. */
export async function getChildSettings(childId: string): Promise<ChildSettings | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('child_settings')
    .select('*')
    .eq('child_id', childId)
    .single()
  return data ?? null
}
