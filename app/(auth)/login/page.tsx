import type { Metadata } from 'next'
import LoginForm from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Sign In — CoinSprout',
}

export default function LoginPage() {
  return (
    <div className="card-surface p-8 space-y-6">
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
