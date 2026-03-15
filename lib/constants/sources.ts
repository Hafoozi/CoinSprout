import type { TransactionSource } from '@/types/database'

/** All valid money source values. */
export const TRANSACTION_SOURCES = ['allowance', 'gift', 'interest', 'jobs', 'spend'] as const

/** Sources that add money (positive transactions). */
export const INCOME_SOURCES = ['allowance', 'gift', 'interest', 'jobs'] as const

export type IncomeSource = (typeof INCOME_SOURCES)[number]

/** Human-readable labels for each source. */
export const SOURCE_LABELS: Record<TransactionSource, string> = {
  allowance: 'Allowance',
  gift:      'Gift',
  interest:  'Interest',
  jobs:      'Jobs',
  spend:     'Spending',
}

/** Tailwind color classes for each income source (used in badges and fruit). */
export const SOURCE_COLORS: Record<IncomeSource, { bg: string; text: string; border: string; hex: string }> = {
  allowance: {
    bg:     'bg-sprout-100',
    text:   'text-sprout-700',
    border: 'border-sprout-300',
    hex:    '#4ade80',
  },
  gift: {
    bg:     'bg-purple-100',
    text:   'text-purple-700',
    border: 'border-purple-300',
    hex:    '#c084fc',
  },
  interest: {
    bg:     'bg-teal-100',
    text:   'text-teal-700',
    border: 'border-teal-300',
    hex:    '#2dd4bf',
  },
  jobs: {
    bg:     'bg-blue-100',
    text:   'text-blue-700',
    border: 'border-blue-300',
    hex:    '#60a5fa',
  },
}
