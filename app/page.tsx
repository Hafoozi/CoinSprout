import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Root page: redirect authenticated users to the dashboard,
 * unauthenticated users to login.
 * The middleware also handles this — this is a safety fallback.
 */
export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect(ROUTES.PARENT.DASHBOARD)
  } else {
    redirect(ROUTES.LOGIN)
  }
}
