import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { ROUTES } from '@/lib/constants/routes'
import { AVATAR_BG } from '@/lib/constants/avatar-colors'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CoinSprout',
}

/**
 * Child landing page — designed to be saved as a PWA shortcut on a child's device.
 * One child  → redirects straight to their dashboard.
 * Many children → shows a "Who's here?" picker.
 */
export default async function KidsPage() {
  const { family } = await requireParent()
  const children   = await getChildrenByFamilyId(family.id)

  if (children.length === 0) redirect(ROUTES.PARENT.DASHBOARD)
  if (children.length === 1) redirect(ROUTES.CHILD.HOME(children[0].id))

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 pt-8">
      <div className="text-center space-y-1">
        <p className="text-2xl font-bold text-gray-800">Who&apos;s here?</p>
        <p className="text-sm text-gray-400">Tap your name to see your tree</p>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {children.map((child) => {
          const colorClass = AVATAR_BG[child.avatar_color ?? 'sprout'] ?? AVATAR_BG.sprout
          return (
            <Link
              key={child.id}
              href={ROUTES.CHILD.HOME(child.id)}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-white/60 active:scale-95 transition-all"
            >
              <div className={`flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold ${colorClass}`}>
                {child.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-lg font-semibold text-gray-700">{child.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
