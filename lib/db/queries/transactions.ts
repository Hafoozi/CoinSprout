import { createClient } from '@/lib/supabase/server'
import type { Transaction } from '@/lib/db/types'

/** Fetch all transactions for a child, ordered newest first. */
export async function getTransactionsByChildId(childId: string): Promise<Transaction[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
  return data ?? []
}

/** Fetch the N most recent transactions for a child (default 10). */
export async function getRecentTransactions(childId: string, limit = 10): Promise<Transaction[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}
