'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth/require-parent'
import { upsertRecurringAllowance } from '@/lib/db/mutations/recurring-allowances'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { ROUTES } from '@/lib/constants/routes'
import type { ActionResult } from '@/types/ui'

export async function saveRecurringAllowance(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const { family } = await requireParent()

  const childId    = formData.get('childId')    as string
  const amountStr  = formData.get('amount')     as string
  const dayStr     = formData.get('dayOfWeek')  as string
  const isActiveStr = formData.get('isActive')  as string

  if (!childId || !amountStr || !dayStr) {
    return { success: false, error: 'Missing required fields' }
  }

  // Verify this child belongs to the family
  const children = await getChildrenByFamilyId(family.id)
  if (!children.some((c) => c.id === childId)) {
    return { success: false, error: 'Child not found' }
  }

  const amount    = parseFloat(amountStr)
  const dayOfWeek = parseInt(dayStr, 10)
  const isActive  = isActiveStr === 'true'

  if (isNaN(amount) || amount <= 0) {
    return { success: false, error: 'Amount must be greater than 0' }
  }
  if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
    return { success: false, error: 'Invalid day of week' }
  }

  const result = await upsertRecurringAllowance({ childId, amount, dayOfWeek, isActive })
  if (!result) return { success: false, error: 'Failed to save' }

  revalidatePath(ROUTES.PARENT.SETTINGS)
  return { success: true }
}
