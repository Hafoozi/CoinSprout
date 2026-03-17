'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import Dialog from '@/components/ui/dialog'
import PinPad from '@/components/ui/pin-pad'
import { verifyParentPin } from '@/actions/profile-switch'
import { getChildDisplayInfo } from '@/actions/children'
import { AVATAR_BG } from '@/lib/constants/avatar-colors'
import { ROUTES } from '@/lib/constants/routes'
import CoinSproutLogo from '@/components/ui/coin-sprout-logo'

function ChildAvatar() {
  const params  = useParams<{ childId: string }>()
  const childId = params?.childId
  const [info, setInfo] = useState<{ name: string; avatarColor: string } | null>(null)

  useEffect(() => {
    if (!childId) return
    getChildDisplayInfo(childId).then(setInfo)
  }, [childId])

  if (!info) return null

  const colorClass = AVATAR_BG[info.avatarColor] ?? AVATAR_BG.sprout

  return (
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${colorClass}`}>
      {info.name.charAt(0).toUpperCase()}
    </div>
  )
}

function BackToParentButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()

  function handlePin(pin: string) {
    setError(undefined)
    startTransition(async () => {
      const result = await verifyParentPin(pin)
      if (result.success) {
        setOpen(false)
        router.push(ROUTES.PARENT.DASHBOARD)
      } else {
        setError(result.error ?? 'Incorrect PIN')
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setError(undefined); setOpen(true) }}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white/60 transition-colors"
      >
        🔒 Parent
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Parent Access">
        <PinPad
          title="Enter parent PIN"
          subtitle="Switch back to parent view"
          error={error}
          isLoading={isPending}
          onComplete={handlePin}
        />
      </Dialog>
    </>
  )
}

function ChildNav() {
  const params   = useParams<{ childId: string }>()
  const pathname = usePathname()
  const childId  = params?.childId

  if (!childId) return null

  const tabs = [
    { label: 'Tree',     href: ROUTES.CHILD.HOME(childId),     icon: '🌳' },
    { label: 'Goals',    href: ROUTES.CHILD.GOALS(childId),    icon: '🎯' },
    { label: 'Activity', href: ROUTES.CHILD.ACTIVITY(childId), icon: '📋' },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-10 bg-white/90 backdrop-blur border-t border-sprout-100 flex">
      {tabs.map(({ label, href, icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors',
              active ? 'text-sprout-700' : 'text-gray-400 hover:text-gray-600',
            ].join(' ')}
          >
            <span className="text-xl leading-none">{icon}</span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export default function ChildShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="child-bg min-h-screen">
      <header className="sticky top-0 z-10 h-14 bg-white/80 backdrop-blur border-b border-sprout-100 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <CoinSproutLogo size={28} />
          <span className="font-bold text-sprout-700 text-lg tracking-tight">CoinSprout</span>
          <ChildAvatar />
        </div>
        <BackToParentButton />
      </header>
      <main className="max-w-3xl mx-auto px-4 pb-24">
        {children}
      </main>
      <ChildNav />
    </div>
  )
}
