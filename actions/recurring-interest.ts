'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth/require-parent'
import { upsertRecurringInterest } from '@/lib/db/mutations/recurring-interest'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { ROUTES } from '@/lib/constants/routes'
import type { ActionResult } from '@/types/ui'

export async function saveRecurringInterest(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const { family } = await requireParent()

  const childId     = formData.get('childId')   as string
  const rateStr     = formData.get('rate')       as string
  const dayStr      = formData.get('dayOfWeek')  as string
  const isActiveStr = formData.get('isActive')   as string

  if (!childId || !rateStr || !dayStr) {
    return { success: false, error: 'Missing required fields' }
  }

  const children = await getChildrenByFamilyId(family.id)
  if (!children.some((c) => c.id === childId)) {
    return { success: false, error: 'Child not found' }
  }

  const rate      = parseFloat(rateStr)
  const dayOfWeek = parseInt(dayStr, 10)
  const isActive  = isActiveStr === 'true'

  if (isNaN(rate) || rate < 0.01) {
    return { success: false, error: 'Rate must be at least 0.01%' }
  }
  if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
    return { success: false, error: 'Invalid day of week' }
  }

  const result = await upsertRecurringInterest({ childId, rate, dayOfWeek, isActive })
  if (!result) return { success: false, error: 'Failed to save' }

  revalidatePath(ROUTES.PARENT.SETTINGS)
  revalidatePath(ROUTES.PARENT.CHILD(childId))
  return { success: true }
}
