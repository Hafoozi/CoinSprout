import { z } from 'zod'

export const createGoalSchema = z.object({
  childId:     z.string().uuid(),
  name:        z.string().min(1, 'Goal name is required').max(50),
  targetPrice: z.number().positive('Target must be greater than zero').max(99999),
})

export const allocateGoalSchema = z.object({
  goalId: z.string().uuid(),
  amount: z.number().positive('Amount must be greater than zero'),
})

export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type AllocateGoalInput = z.infer<typeof allocateGoalSchema>
