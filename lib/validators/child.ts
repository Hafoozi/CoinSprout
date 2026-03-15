import { z } from 'zod'

export const createChildSchema = z.object({
  name:        z.string().min(1, 'Name is required').max(30),
  birthdate:   z.string().optional(),
  avatarColor: z.string().optional(),
})

export const updateChildSchema = z.object({
  childId:     z.string().uuid(),
  name:        z.string().min(1, 'Name is required').max(30),
  birthdate:   z.string().optional(),
  avatarColor: z.string().optional(),
})

export type CreateChildInput = z.infer<typeof createChildSchema>
export type UpdateChildInput = z.infer<typeof updateChildSchema>
