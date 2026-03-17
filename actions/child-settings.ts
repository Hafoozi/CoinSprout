'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildById } from '@/lib/db/queries/children'
import { upsertChildSettings } from '@/lib/db/mutations/child-settings'
import { childSettingsSchema } from '@/lib/validators/child-settings'
import { ROUTES } from '@/lib/constants/routes'
import type { ActionResult } from '@/types/ui'

export async function saveChildSettings(_: unknown, formData: FormData): Promise<ActionResult> {
  await requireParent()

  const raw = {
    childId:        formData.get('childId'),
    treeYoung:      Number(formData.get('treeYoung')),
    treeGrowing:    Number(formData.get('treeGrowing')),
    treeMature:     Number(formData.get('treeMature')),
    treeAncient:    Number(formData.get('treeAncient')),
    milestoneBunny: Number(formData.get('milestoneBunny')),
    milestoneBird:  Number(formData.get('milestoneBird')),
    milestoneDeer:  Number(formData.get('milestoneDeer')),
    milestoneOwl:   Number(formData.get('milestoneOwl')),
    milestoneFox:   Number(formData.get('milestoneFox')),
    fruitBaseValue: Number(formData.get('fruitBaseValue')),
  }

  const parsed = childSettingsSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const child = await getChildById(parsed.data.childId)
  if (!child) return { success: false, error: 'Child not found' }

  const result = await upsertChildSettings(parsed.data)
  if (!result) return { success: false, error: 'Failed to save settings' }

  revalidatePath(ROUTES.PARENT.CHILD(parsed.data.childId))
  revalidatePath(ROUTES.CHILD.HOME(parsed.data.childId))
  return { success: true }
}
