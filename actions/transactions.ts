'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth/require-parent'
import { createTransaction, updateTransaction, deleteTransaction } from '@/lib/db/mutations/transactions'
import { getChildById } from '@/lib/db/queries/children'
import { addMoneySchema, recordSpendSchema, updateTransactionSchema, deleteTransactionSchema } from '@/lib/validators/transaction'
import { ROUTES } from '@/lib/constants/routes'
import type { ActionResult } from '@/types/ui'

export async function addTransaction(_: unknown, formData: FormData): Promise<ActionResult> {
  await requireParent()

  const parsed = addMoneySchema.safeParse({
    childId: formData.get('childId'),
    amount:  Number(formData.get('amount')),
    source:  formData.get('source'),
    note:    formData.get('note') || undefined,
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  // Verify the child exists and belongs to this parent (RLS enforces this at DB level,
  // but an early check gives a clearer error message).
  const child = await getChildById(parsed.data.childId)
  if (!child) return { success: false, error: 'Child not found' }

  const tx = await createTransaction({
    childId: parsed.data.childId,
    amount:  parsed.data.amount,    // always positive for income
    source:  parsed.data.source,
    note:    parsed.data.note,
  })
  if (!tx) return { success: false, error: 'Failed to record transaction' }

  revalidatePath(ROUTES.PARENT.CHILD(parsed.data.childId))
  revalidatePath(ROUTES.PARENT.DASHBOARD)
  return { success: true }
}

export async function recordSpend(_: unknown, formData: FormData): Promise<ActionResult> {
  await requireParent()

  const parsed = recordSpendSchema.safeParse({
    childId: formData.get('childId'),
    amount:  Number(formData.get('amount')),
    note:    formData.get('note') || undefined,
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const child = await getChildById(parsed.data.childId)
  if (!child) return { success: false, error: 'Child not found' }

  const tx = await createTransaction({
    childId: parsed.data.childId,
    amount:  -Math.abs(parsed.data.amount),  // always stored as negative
    source:  'spend',
    note:    parsed.data.note,
  })
  if (!tx) return { success: false, error: 'Failed to record spending' }

  revalidatePath(ROUTES.PARENT.CHILD(parsed.data.childId))
  revalidatePath(ROUTES.PARENT.DASHBOARD)
  return { success: true }
}

export async function editTransaction(_: unknown, formData: FormData): Promise<ActionResult> {
  await requireParent()

  const parsed = updateTransactionSchema.safeParse({
    transactionId: formData.get('transactionId'),
    childId:       formData.get('childId'),
    amount:        Number(formData.get('amount')),
    source:        formData.get('source'),
    note:          formData.get('note') || undefined,
    date:          formData.get('date') || undefined,
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const child = await getChildById(parsed.data.childId)
  if (!child) return { success: false, error: 'Child not found' }

  const tx = await updateTransaction({
    transactionId: parsed.data.transactionId,
    childId:       parsed.data.childId,
    amount:        parsed.data.amount,
    source:        parsed.data.source,
    note:          parsed.data.note,
    date:          parsed.data.date,
  })
  if (!tx) return { success: false, error: 'Failed to update transaction' }

  revalidatePath(ROUTES.PARENT.CHILD(parsed.data.childId))
  revalidatePath(ROUTES.PARENT.DASHBOARD)
  return { success: true }
}

export async function removeTransaction(_: unknown, formData: FormData): Promise<ActionResult> {
  await requireParent()

  const parsed = deleteTransactionSchema.safeParse({
    transactionId: formData.get('transactionId'),
    childId:       formData.get('childId'),
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const child = await getChildById(parsed.data.childId)
  if (!child) return { success: false, error: 'Child not found' }

  const ok = await deleteTransaction(parsed.data.transactionId, parsed.data.childId)
  if (!ok) return { success: false, error: 'Failed to delete transaction' }

  revalidatePath(ROUTES.PARENT.CHILD(parsed.data.childId))
  revalidatePath(ROUTES.PARENT.DASHBOARD)
  return { success: true }
}
