import { z } from 'zod'

export const loginSchema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signUpSchema = z.object({
  email:           z.string().email('Enter a valid email address'),
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path:    ['confirmPassword'],
})

export const pinSchema = z.object({
  pin: z.string().length(4, 'PIN must be exactly 4 digits').regex(/^\d{4}$/, 'PIN must be 4 numbers'),
})

export type LoginInput   = z.infer<typeof loginSchema>
export type SignUpInput  = z.infer<typeof signUpSchema>
export type PinInput     = z.infer<typeof pinSchema>
