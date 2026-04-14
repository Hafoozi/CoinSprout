'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildById, getChildrenByFamilyId } from '@/lib/db/queries/children'
import { getFamilySettings } from '@/lib/db/queries/family-settings'
import { createChild, updateChild, deleteChild } from '@/lib/db/mutations/children'
import { createChildSchema, updateChildSchema } from '@/lib/validators/child'
import { ROUTES } from '@/lib/constants/routes'
import { redirect } from 'next/navigation'
import type { ActionResult } from '@/types/ui'

/** All data the ChildShell needs, fetched in one parallel call. */
export async function getChildShellInfo(childId: string): Promise<{
  name:               string
  avatarColor:        string
  siblings:           { id: string; name: string; avatarColor: string; hasPin: boolean }[]
  quickAccessEnabled: boolean
} | null> {
  try {
    const { family } = await requireParent()
    const [allChildren, settings] = await Promise.all([
      getChildrenByFamilyId(family.id),
      getFamilySettings(family.id),
    ])
    const current = allChildren.find((c) => c.id === childId)
    if (!current) return null
    return {
      name:        current.name,
      avatarColor: current.avatar_color ?? 'sprout',
      siblings:    allChildren
        .filter((c) => c.id !== childId)
        .map((c) => ({
          id:          c.id,
          name:        c.name,
          avatarColor: c.avatar_color ?? 'sprout',
          hasPin:      !!c.pin_hash,
        })),
      quickAccessEnabled: settings?.quick_access_enabled ?? false,
    }
  } catch {
    return null
  }
}

export async function getChildDisplayInfo(
  childId: string
): Promise<{ name: string; avatarColor: string } | null> {
  const child = await getChildById(childId)
  if (!child) return null
  return { name: child.name, avatarColor: child.avatar_color ?? 'sprout' }
}

export async function addChild(_: unknown, formData: FormData): Promise<ActionResult> {
  const { family } = await requireParent()

  const parsed = createChildSchema.safeParse({
    name:        formData.get('name'),
    birthdate:   formData.get('birthdate') || undefined,
    avatarColor: formData.get('avatarColor') || undefined,
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const child = await createChild({ familyId: family.id, ...parsed.data })
  if (!child) return { success: false, error: 'Failed to create child profile' }

  revalidatePath(ROUTES.PARENT.DASHBOARD)
  return { success: true }
}

export async function removeChild(childId: string): Promise<ActionResult> {
  const { family } = await requireParent()

  const children = await import('@/lib/db/queries/children')
    .then(m => m.getChildrenByFamilyId(family.id))
  if (!children.some((c) => c.id === childId)) {
    return { success: false, error: 'Child not found' }
  }

  const ok = await deleteChild(childId)
  if (!ok) return { success: false, error: 'Failed to delete profile' }

  revalidatePath(ROUTES.PARENT.DASHBOARD)
  redirect(ROUTES.PARENT.DASHBOARD)
}

export async function editChild(_: unknown, formData: FormData): Promise<ActionResult> {
  await requireParent()

  const parsed = updateChildSchema.safeParse({
    childId:     formData.get('childId'),
    name:        formData.get('name'),
    birthdate:   formData.get('birthdate') || undefined,
    avatarColor: formData.get('avatarColor') || undefined,
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const child = await updateChild(parsed.data.childId, {
    name:        parsed.data.name,
    birthdate:   parsed.data.birthdate ?? null,
    avatarColor: parsed.data.avatarColor ?? null,
  })
  if (!child) return { success: false, error: 'Failed to update profile' }

  revalidatePath(ROUTES.PARENT.CHILD(parsed.data.childId))
  revalidatePath(ROUTES.PARENT.DASHBOARD)
  return { success: true }
}
