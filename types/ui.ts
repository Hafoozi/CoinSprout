/**
 * UI-level types: props shapes, component state, and form data.
 */

// ─── Generic ───────────────────────────────────────────────────────────────

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface ActionResult {
  success: boolean
  error?: string
  /** The form field name that caused the error, if applicable. */
  errorField?: string
  /** Non-error message to surface to the user (e.g. "Check your email"). */
  message?: string
}

// ─── Forms ─────────────────────────────────────────────────────────────────

export interface AddMoneyFormData {
  childId: string
  amount: string
  source: 'allowance' | 'gift' | 'interest' | 'jobs'
  note: string
  date: string
}

export interface RecordSpendFormData {
  childId: string
  amount: string
  note: string
  date: string
}

export interface CreateGoalFormData {
  childId: string
  name: string
  targetPrice: string
}

export interface AllocateGoalFormData {
  goalId: string
  amount: string
}

export interface RecurringAllowanceFormData {
  childId: string
  amount: string
  dayOfWeek: number
  isActive: boolean
}

// ─── PIN ───────────────────────────────────────────────────────────────────

export interface PinEntryState {
  pin: string
  error: string | null
  attempts: number
}
