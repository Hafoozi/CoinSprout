import { createClient } from '@/lib/supabase/server'
import { syncMilestones } from '@/lib/db/mutations/milestones'
import type { Transaction, TransactionSource } from '@/lib/db/types'

export async function createTransaction(data: {
  childId: string
  amount: number        // positive = income, negative = spend
  source: TransactionSource
  note?: string
}): Promise<Transaction | null> {
  const supabase = await createClient()

  const { data: tx } = await supabase
    .from('transactions')
    .insert({
      child_id: data.childId,
      amount:   data.amount,
      source:   data.source,
      note:     data.note ?? null,
    })
    .select()
    .single()

  if (!tx) return null

  // Milestone check only applies to positive (income) transactions.
  // Spending never reduces lifetime earnings so it can't unlock milestones.
  if (tx.amount > 0) {
    await syncMilestones(tx.child_id)
  }

  return tx
}

export async function updateTransaction(data: {
  transactionId: string
  childId:       string
  amount:        number   // always positive; caller preserves sign based on source
  source:        TransactionSource
  note?:         string
  date?:         string   // ISO date string YYYY-MM-DD
}): Promise<Transaction | null> {
  const supabase = await createClient()

  // Sign: spend transactions are stored negative, income transactions positive
  const signedAmount = data.source === 'spend' ? -Math.abs(data.amount) : Math.abs(data.amount)

  const updatePayload: Record<string, unknown> = {
    amount: signedAmount,
    source: data.source,
    note:   data.note ?? null,
  }
  if (data.date) {
    updatePayload.created_at = `${data.date}T12:00:00`
  }

  const { data: tx } = await supabase
    .from('transactions')
    .update(updatePayload)
    .eq('id', data.transactionId)
    .eq('child_id', data.childId)   // RLS double-check
    .select()
    .single()

  if (!tx) return null

  // Re-sync milestones in case the amount changed
  await syncMilestones(data.childId)

  return tx
}

export async function deleteTransaction(
  transactionId: string,
  childId: string,
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('child_id', childId)   // RLS double-check

  if (error) return false

  // Re-sync milestones since lifetime earnings may have changed
  await syncMilestones(childId)

  return true
}
