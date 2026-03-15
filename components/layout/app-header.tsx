import Link from 'next/link'
import { signOut } from '@/actions/auth'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Shared top navigation bar for parent mode.
 * Sign-out is a plain HTML form action — no client JS required.
 */
export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 h-14 bg-white border-b border-sprout-100 flex items-center justify-between px-4">
      <Link
        href={ROUTES.PARENT.DASHBOARD}
        className="font-bold text-sprout-700 text-lg tracking-tight"
      >
        🌱 CoinSprout
      </Link>

      <form action={signOut}>
        <button
          type="submit"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Sign out
        </button>
      </form>
    </header>
  )
}
