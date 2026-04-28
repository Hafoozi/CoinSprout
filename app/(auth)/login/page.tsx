import type { Metadata } from 'next'
import LoginForm from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Sign In — CoinSprout',
}

export default function LoginPage({ searchParams }: { searchParams: { auth_error?: string } }) {
  const authError = searchParams.auth_error
  return (
    <div className="card-surface p-8 space-y-6">
      {authError && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 font-mono break-all">
          Auth error: {authError}
        </p>
      )}
      {/* Logo / wordmark */}
      <div className="text-center space-y-1">
        <div className="text-4xl">🌱</div>
        <h1 className="text-2xl font-bold text-sprout-800">CoinSprout</h1>
        <p className="text-sm text-sprout-600">Parent sign in</p>
      </div>

      <LoginForm />
    </div>
  )
}
