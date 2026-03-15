import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Server-side helper: returns the authenticated user or redirects to login.
 * Use in Server Components and Server Actions.
 */
export async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)
  return user
}
