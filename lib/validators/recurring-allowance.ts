import { z } from 'zod'

export const recurringAllowanceSchema = z.object({
  childId:    z.string().uuid(),
  amount:     z.number().positive('Amount must be greater than zero').max(999),
  dayOfWeek:  z.number().int().min(0).max(6),
  isActive:   z.boolean(),
})

export type RecurringAllowanceInput = z.infer<typeof recurringAllowanceSchema>
