import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Root page: redirect authenticated users based on their last-used mode.
 * - cs_mode=child  → /kids  (child profile picker)
 * - cs_mode=parent → /dashboard (default)
 * Unauthenticated users go to /login.
 */
export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const cookieStore = await cookies()
    const mode = cookieStore.get('cs_mode')?.value
    if (mode === 'child') {
      redirect(ROUTES.CHILD.KIDS)
    } else {
      redirect(ROUTES.PARENT.DASHBOARD)
    }
  } else {
    redirect(ROUTES.LOGIN)
  }
}
