'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/actions/auth'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { ROUTES } from '@/lib/constants/routes'
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

  return (
    <div className="space-y-5">
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
