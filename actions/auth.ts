'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema, signUpSchema } from '@/lib/validators/auth'
import type { ActionResult } from '@/types/ui'

export async function signIn(_: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email:    formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { success: false, error: error.message }

  return { success: true }
}

export async function signUp(_: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse({
    email:           formData.get('email'),
    password:        formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email:    parsed.data.email,
    password: parsed.data.password,
  })
  if (error) return { success: false, error: error.message }

  // If email confirmation is required, the session is null here.
  // The family row is created by requireParent() on first authenticated request.
  if (!data.session) {
    return {
      success: true,
      message: 'Check your email to confirm your account, then sign in.',
    }
  }

  return { success: true }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
