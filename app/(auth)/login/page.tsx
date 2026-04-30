import type { Metadata } from 'next'
import LoginForm from '@/components/auth/login-form'
import CoinSproutLogo from '@/components/ui/coin-sprout-logo'

export const metadata: Metadata = {
  title: 'Sign In — CoinSprout',
}

export default function LoginPage() {
  return (
    <div className="card-surface p-8 space-y-6">
      {/* Logo / wordmark */}
      <div className="text-center space-y-1">
        <div className="flex justify-center">
            <CoinSproutLogo size={56} />
          </div>
        <h1 className="text-2xl font-bold text-sprout-800">CoinSprout</h1>
        <p className="text-sm text-sprout-600">Parent sign in</p>
      </div>

      <LoginForm />
    </div>
  )
}
