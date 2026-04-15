import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

/**
 * Refreshes the Supabase session on every request and handles
 * auth-based redirects.
 *
 * Called from the root middleware.ts on every matched route.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session — must be called before any redirect logic.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const isPublicRoute = pathname.startsWith('/login') || pathname.startsWith('/auth') || pathname.startsWith('/api/cron')

  if (!user && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  if (user && pathname === '/login') {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  // Track which mode (parent vs child) was last used so the PWA start_url
  // redirect in app/page.tsx can send the user to the right place.
  const isChildRoute  = pathname.startsWith('/kids') || pathname.startsWith('/child/')
  const isParentRoute = pathname.startsWith('/dashboard') ||
                        pathname.startsWith('/children') ||
                        pathname.startsWith('/goals') ||
                        pathname.startsWith('/transactions') ||
                        pathname.startsWith('/settings')

  if (isChildRoute) {
    supabaseResponse.cookies.set('cs_mode', 'child',  { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  } else if (isParentRoute) {
    supabaseResponse.cookies.set('cs_mode', 'parent', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  }

  return supabaseResponse
}
