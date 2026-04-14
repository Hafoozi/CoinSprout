'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth/require-parent'
import { upsertRecurringInterest, setInterestNextPaymentDate } from '@/lib/db/mutations/recurring-interest'
import { getRecurringInterestByChildId } from '@/lib/db/queries/recurring-interest'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { calcNextPaymentDate, addDaysToDate } from '@/lib/utils/payment-date'
import { ROUTES } from '@/lib/constants/routes'
import type { ActionResult } from '@/types/ui'

async function verifyChild(familyId: string, childId: string): Promise<boolean> {
  const children = await getChildrenByFamilyId(familyId)
  return children.some((c) => c.id === childId)
}

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

  if (!await verifyChild(family.id, childId)) {
    return { success: false, error: 'Child not found' }
  }

  const rate      = parseFloat(rateStr)
  const dayOfWeek = parseInt(dayStr, 10)
  const isActive  = isActiveStr === 'true'

  if (isNaN(rate) || rate < 0.01) {
    return { success: false, error: 'Rate must be at least 0.01%' }
  }
  if (rate > 100) {
    return { success: false, error: 'Rate cannot exceed 100%' }
  }
  if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
    return { success: false, error: 'Invalid day of week' }
  }

  // Preserve existing next_payment_date if the day hasn't changed.
  const existing = await getRecurringInterestByChildId(childId)
  const nextPaymentDate =
    existing && existing.day_of_week === dayOfWeek && existing.next_payment_date
      ? existing.next_payment_date
      : calcNextPaymentDate(dayOfWeek)

  const result = await upsertRecurringInterest({ childId, rate, dayOfWeek, isActive, nextPaymentDate })
  if (!result) return { success: false, error: 'Failed to save' }

  revalidatePath(ROUTES.PARENT.SETTINGS)
  revalidatePath(ROUTES.PARENT.CHILD(childId))
  return { success: true }
}

/** Skip the next interest payout — pushes next_payment_date forward by 7 days. */
export async function skipNextInterest(childId: string): Promise<ActionResult> {
  const { family } = await requireParent()

  if (!await verifyChild(family.id, childId)) {
    return { success: false, error: 'Child not found' }
  }

  const interest = await getRecurringInterestByChildId(childId)
  if (!interest?.is_active) return { success: false, error: 'No active interest' }

  const base = interest.next_payment_date ?? calcNextPaymentDate(interest.day_of_week)
  await setInterestNextPaymentDate(childId, addDaysToDate(base, 7))

  revalidatePath(ROUTES.PARENT.SETTINGS)
  revalidatePath(ROUTES.PARENT.CHILD(childId))
  return { success: true }
}

/** Undo a skip — resets next_payment_date to the next natural occurrence. */
export async function undoSkipInterest(childId: string): Promise<ActionResult> {
  const { family } = await requireParent()

  if (!await verifyChild(family.id, childId)) {
    return { success: false, error: 'Child not found' }
  }

  const interest = await getRecurringInterestByChildId(childId)
  if (!interest?.is_active) return { success: false, error: 'No active interest' }

  await setInterestNextPaymentDate(childId, calcNextPaymentDate(interest.day_of_week))

  revalidatePath(ROUTES.PARENT.SETTINGS)
  revalidatePath(ROUTES.PARENT.CHILD(childId))
  return { success: true }
}
