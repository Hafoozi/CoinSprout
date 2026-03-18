import { createClient } from '@/lib/supabase/server'
import type { Child } from '@/lib/db/types'

export async function createChild(data: {
  familyId: string
  name: string
  birthdate?: string
  avatarColor?: string
}): Promise<Child | null> {
  const supabase = await createClient()
  const { data: child } = await supabase
    .from('children')
    .insert({
      family_id:    data.familyId,
      name:         data.name,
      birthdate:    data.birthdate ?? null,
      avatar_color: data.avatarColor ?? null,
    })
    .select()
    .single()
  return child ?? null
}

export async function updateChild(
  childId: string,
  data: { name?: string; birthdate?: string | null; avatarColor?: string | null }
): Promise<Child | null> {
  const supabase = await createClient()
  const { data: child } = await supabase
    .from('children')
    .update({
      ...(data.name        !== undefined && { name:         data.name }),
      ...(data.birthdate   !== undefined && { birthdate:    data.birthdate }),
      ...(data.avatarColor !== undefined && { avatar_color: data.avatarColor }),
    })
    .eq('id', childId)
    .select()
    .single()
  return child ?? null
}

export async function deleteChild(childId: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId)
  return !error
}

export async function updateChildPin(childId: string, pinHash: string): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('children')
    .update({ pin_hash: pinHash })
    .eq('id', childId)
}
