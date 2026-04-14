import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { ROUTES } from '@/lib/constants/routes'
import KidsProfileSelect from '@/components/kids/kids-profile-select'
import CoinSproutLogo from '@/components/ui/coin-sprout-logo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CoinSprout',
}

/**
 * Child landing page — designed to be saved as a PWA shortcut on a child's device.
 * One child with no PIN  → redirects straight to their dashboard.
 * Otherwise             → shows a "Who's here?" picker with PIN entry if set.
 */
export default async function KidsPage() {
  const { family } = await requireParent()
  const children   = await getChildrenByFamilyId(family.id)

  if (children.length === 0) redirect(ROUTES.PARENT.DASHBOARD)
  if (children.length === 1 && !children[0].pin_hash) redirect(ROUTES.CHILD.HOME(children[0].id))

  const profiles = children.map((c) => ({
    id:          c.id,
    name:        c.name,
    avatarColor: c.avatar_color,
    hasPin:      !!c.pin_hash,
  }))

  return (
    <div className="child-bg min-h-screen">
      <header className="sticky top-0 z-10 h-14 bg-white/80 backdrop-blur border-b border-sprout-100 flex items-center px-4 gap-2">
        <CoinSproutLogo size={38} />
        <span className="font-bold text-sprout-700 text-lg tracking-tight">CoinSprout</span>
        <Link
          href={ROUTES.PARENT.DASHBOARD}
          className="ml-auto text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          🔒 Parent
        </Link>
      </header>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] space-y-8 px-4">
        <div className="text-center space-y-1">
          <p className="text-2xl font-bold text-gray-800">Who&apos;s here?</p>
          <p className="text-sm text-gray-400">Tap your name to see your tree</p>
        </div>
        <KidsProfileSelect children={profiles} />
      </div>
    </div>
  )
}
