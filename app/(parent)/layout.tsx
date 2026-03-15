import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import ParentShell from '@/components/layout/parent-shell'

/**
 * Parent route group layout.
 * Guards all /dashboard, /children, /goals, /transactions routes.
 * Redirects to login if the user is not authenticated.
 */
export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  return <ParentShell>{children}</ParentShell>
}
