'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/actions/auth'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/client'
import type { ActionResult } from '@/types/ui'

const INITIAL: ActionResult = { success: false }

// Separate submit button so it can read useFormStatus inside the form.
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" isLoading={pending}>
      {label}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  const [signInState, signInAction] = useFormState(signIn, INITIAL)
  const [signUpState, signUpAction] = useFormState(signUp, INITIAL)

  // Redirect to dashboard on successful sign-in or immediate sign-up (no email confirmation)
  useEffect(() => {
    if (signInState.success && !signInState.message) {
      router.push(ROUTES.PARENT.DASHBOARD)
    }
  }, [signInState, router])

  useEffect(() => {
    if (signUpState.success && !signUpState.message) {
      router.push(ROUTES.PARENT.DASHBOARD)
    }
  }, [signUpState, router])

  const state = mode === 'signin' ? signInState : signUpState

  async function handleGoogleSignIn() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="space-y-5">
      {/* Google sign-in */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl bg-gray-100 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
            mode === 'signin' ? 'bg-white text-sprout-700 shadow-sm' : 'text-gray-500'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
            mode === 'signup' ? 'bg-white text-sprout-700 shadow-sm' : 'text-gray-500'
          }`}
        >
          Create account
        </button>
      </div>

      {/* Sign-in form */}
      {mode === 'signin' && (
        <form action={signInAction} className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          {signInState.error && (
            <p className="text-sm text-red-500">{signInState.error}</p>
          )}
          <SubmitButton label="Sign in" />
        </form>
      )}

      {/* Sign-up form */}
      {mode === 'signup' && (
        <form action={signUpAction} className="space-y-4">
          <Input
            id="su-email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          <Input
            id="su-password"
            name="password"
            type="password"
            label="Password"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            required
          />
          <Input
            id="su-confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
          {signUpState.error && (
            <p className="text-sm text-red-500">{signUpState.error}</p>
          )}
          {signUpState.message && (
            <p className="rounded-xl bg-sprout-50 p-3 text-sm text-sprout-700">
              {signUpState.message}
            </p>
          )}
          {!signUpState.message && <SubmitButton label="Create account" />}
        </form>
      )}

      {/* General error */}
      {!state.error && !state.message && state.success === false && state !== INITIAL && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}
    </div>
  )
}
