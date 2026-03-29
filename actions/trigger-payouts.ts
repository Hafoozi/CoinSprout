'use server'

import { requireParent } from '@/lib/auth/require-parent'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { createClient } from '@/lib/supabase/server'

const MIN_INTEREST_PAYOUT = 0.05

export interface ChildPayoutResult {
  childName: string
  interest:  { status: 'paid' | 'already_paid' | 'skipped' | 'none' | 'error'; amount?: number; reason?: string }
  allowance: { status: 'paid' | 'already_paid' | 'skipped' | 'none' | 'error'; amount?: number; reason?: string }
}

/**
 * Manually trigger allowance + interest payouts for all children in this family.
 * Skips the day-of-week check (manual run) but still prevents double-paying on the same calendar day.
 */
export async function triggerPayoutsNow(): Promise<{ results: ChildPayoutResult[] }> {
  const { family } = await requireParent()
  const supabase   = await createClient()
  const children   = await getChildrenByFamilyId(family.id)
  const today      = new Date().toISOString().slice(0, 10)
  const results: ChildPayoutResult[] = []

  for (const child of children) {
    const result: ChildPayoutResult = {
      childName: child.name,
      interest:  { status: 'none' },
      allowance: { status: 'none' },
    }

    // ── Interest ────────────────────────────────────────────────────────────
    const { data: interest } = await supabase
      .from('recurring_interest')
      .select()
      .eq('child_id', child.id)
      .eq('is_active', true)
      .maybeSingle()

    if (interest) {
      if (interest.last_prompted_at?.slice(0, 10) === today) {
        result.interest = { status: 'already_paid' }
      } else {
        const { data: txRows } = await supabase
          .from('transactions')
          .select('amount')
          .eq('child_id', child.id)

        const balance = (txRows ?? []).reduce((sum, t) => sum + t.amount, 0)

        if (balance <= 0) {
          result.interest = { status: 'skipped', reason: 'No savings balance' }
        } else {
          const amount = Math.round(balance * (interest.rate / 100) * 100) / 100
          if (amount < MIN_INTEREST_PAYOUT) {
            result.interest = { status: 'skipped', reason: `$${amount.toFixed(2)} below minimum` }
          } else {
            const { error } = await supabase.from('transactions').insert({
              child_id: child.id,
              amount,
              source: 'interest',
              note:   `${interest.rate}% weekly interest`,
            })
            if (error) {
              result.interest = { status: 'error', reason: error.message }
            } else {
              await supabase
                .from('recurring_interest')
                .update({ last_prompted_at: new Date().toISOString() })
                .eq('child_id', child.id)
              result.interest = { status: 'paid', amount }
            }
          }
        }
      }
    }

    // ── Allowance ───────────────────────────────────────────────────────────
    const { data: allowance } = await supabase
      .from('recurring_allowances')
      .select()
      .eq('child_id', child.id)
      .eq('is_active', true)
      .maybeSingle()

    if (allowance) {
      if (allowance.last_prompted_at?.slice(0, 10) === today) {
        result.allowance = { status: 'already_paid' }
      } else {
        const amount = allowance.next_amount_override ?? allowance.amount
        const { error } = await supabase.from('transactions').insert({
          child_id: child.id,
          amount,
          source: 'allowance',
          note:   'Weekly allowance',
        })
        if (error) {
          result.allowance = { status: 'error', reason: error.message }
        } else {
          await supabase
            .from('recurring_allowances')
            .update({ last_prompted_at: new Date().toISOString(), next_amount_override: null })
            .eq('child_id', child.id)
          result.allowance = { status: 'paid', amount }
        }
      }
    }

    results.push(result)
  }

  return { results }
}
