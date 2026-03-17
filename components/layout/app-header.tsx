import Link from 'next/link'
import { signOut } from '@/actions/auth'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { getChildSettings } from '@/lib/db/queries/child-settings'
import { resolveChildSettings } from '@/lib/calculations/child-settings'
import { ROUTES } from '@/lib/constants/routes'
import ProfileSwitcher from '@/components/layout/profile-switcher'
import CoinSproutLogo from '@/components/ui/coin-sprout-logo'
import type { ResolvedChildSettings } from '@/types/domain'

/**
 * Shared top navigation bar for parent mode.
 * Fetches children to power the profile switcher.
 */
export default async function AppHeader() {
  const { family } = await requireParent()
  const [children, { user }] = await Promise.all([
    getChildrenByFamilyId(family.id),
    (await import('@/lib/supabase/server')).createClient().then(sb => sb.auth.getUser()),
  ])

  // Fetch settings for all children in parallel
  const settingsRows = await Promise.all(children.map(c => getChildSettings(c.id)))
  const settingsMap: Record<string, ResolvedChildSettings> = Object.fromEntries(
    children.map((c, i) => [c.id, resolveChildSettings(settingsRows[i])])
  )

  const parentName = (user?.user_metadata?.full_name as string | undefined)
    || user?.email?.split('@')[0]
    || 'Parent'

  return (
    <header className="sticky top-0 z-10 h-14 bg-white border-b border-sprout-100 flex items-center justify-between px-4">
      <Link
        href={ROUTES.PARENT.DASHBOARD}
        className="flex items-center gap-2 font-bold text-sprout-700 text-lg tracking-tight"
      >
        <CoinSproutLogo size={38} />
        <span>CoinSprout</span>
      </Link>

      <div className="flex items-center gap-2">
        <ProfileSwitcher
          children={children}
          hasParentPin={!!family.parent_pin_hash}
          parentName={parentName}
          settingsMap={settingsMap}
        />

        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  )
}
