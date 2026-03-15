'use server'

import type { ActionResult } from '@/types/ui'

export async function saveRecurringAllowance(_: unknown, formData: FormData): Promise<ActionResult> {
  // TODO: Implement
  // Saves/updates recurring allowance config for one or more children
  return { success: false, error: 'Not implemented' }
}

/**
 * Called by the Vercel Cron job at /api/cron/allowance.
 * Checks all active recurring_allowances, creates allowance transactions for
 * any that are due today and haven't been prompted yet this week.
 * NOT a user-facing action — called from a Route Handler with a secret header check.
 */
export async function processAllowanceCron(): Promise<{ processed: number }> {
  // TODO: Implement
  return { processed: 0 }
}
