import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    // Build the redirect response first so we can attach session cookies to it.
    // Using createClient() from lib/supabase/server won't work here because
    // cookies().set() from next/headers doesn't write to NextResponse.redirect().
    const successResponse = NextResponse.redirect(`${origin}${ROUTES.PARENT.DASHBOARD}`)

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              successResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return successResponse

    const failUrl = `${origin}${ROUTES.LOGIN}?auth_error=${encodeURIComponent(error.message)}`
    return NextResponse.redirect(failUrl)
  }

  return NextResponse.redirect(`${origin}${ROUTES.LOGIN}?auth_error=no_code`)
}
