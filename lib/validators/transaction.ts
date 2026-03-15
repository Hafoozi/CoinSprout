import { z } from 'zod'
import { INCOME_SOURCES, TRANSACTION_SOURCES } from '@/lib/constants/sources'

export const addMoneySchema = z.object({
  childId: z.string().uuid(),
  amount:  z.number().positive('Amount must be greater than zero').max(9999, 'Amount too large'),
  source:  z.enum(INCOME_SOURCES),
  note:    z.string().max(100).optional(),
})

export const recordSpendSchema = z.object({
  childId: z.string().uuid(),
  amount:  z.number().positive('Amount must be greater than zero').max(9999, 'Amount too large'),
  note:    z.string().max(100).optional(),
})

export const updateTransactionSchema = z.object({
  transactionId: z.string().uuid(),
  childId:       z.string().uuid(),
  amount:        z.number().positive('Amount must be greater than zero').max(9999, 'Amount too large'),
  source:        z.enum(TRANSACTION_SOURCES),
  note:          z.string().max(100).optional(),
  date:          z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date').optional(),
})

export const deleteTransactionSchema = z.object({
  transactionId: z.string().uuid(),
  childId:       z.string().uuid(),
})

export type AddMoneyInput = z.infer<typeof addMoneySchema>
export type RecordSpendInput = z.infer<typeof recordSpendSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
