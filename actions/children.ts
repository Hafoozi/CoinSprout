'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth/require-parent'
import { createChild, updateChild } from '@/lib/db/mutations/children'
import { createChildSchema, updateChildSchema } from '@/lib/validators/child'
import { ROUTES } from '@/lib/constants/routes'
import type { ActionResult } from '@/types/ui'

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
