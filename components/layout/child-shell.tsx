'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Dialog from '@/components/ui/dialog'
import PinPad from '@/components/ui/pin-pad'
import TutorialOverlay from '@/components/tutorial/tutorial-overlay'
import { childSteps } from '@/components/tutorial/child-steps'
import { verifyParentPin, verifyChildPin } from '@/actions/profile-switch'
import { AVATAR_BG } from '@/lib/constants/avatar-colors'
import { ROUTES } from '@/lib/constants/routes'
import CoinSproutLogo from '@/components/ui/coin-sprout-logo'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Sibling {
  id:          string
  name:        string
  avatarColor: string
  hasPin:      boolean
}

interface ChildShellProps {
  children:            React.ReactNode
  childId:             string
  name:                string
  avatarColor:         string
  siblings:            Sibling[]
  quickAccessEnabled:  boolean
}

// ── Back-to-parent button ─────────────────────────────────────────────────────

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

// ── Quick Access profile switcher ─────────────────────────────────────────────

type SwitchTarget =
  | { type: 'closed' }
  | { type: 'select' }
  | { type: 'pin-child'; sibling: Sibling }
  | { type: 'pin-parent' }

function QuickProfileSwitcher({ siblings }: { siblings: Sibling[] }) {
  const router  = useRouter()
  const [mode,      setMode]     = useState<SwitchTarget>({ type: 'closed' })
  const [pinError,  setPinError] = useState<string>()
  const [isPending, startTx]     = useTransition()

  if (siblings.length === 0) return null

  function handleSiblingSelect(sibling: Sibling) {
    setPinError(undefined)
    if (sibling.hasPin) {
      setMode({ type: 'pin-child', sibling })
    } else {
      setMode({ type: 'closed' })
      router.push(ROUTES.CHILD.HOME(sibling.id))
    }
  }

  function handleChildPin(sibling: Sibling, pin: string) {
    setPinError(undefined)
    startTx(async () => {
      const result = await verifyChildPin(sibling.id, pin)
      if (result.success) {
        setMode({ type: 'closed' })
        router.push(ROUTES.CHILD.HOME(sibling.id))
      } else {
        setPinError(result.error ?? 'Incorrect PIN')
      }
    })
  }

  function handleParentPin(pin: string) {
    setPinError(undefined)
    startTx(async () => {
      const result = await verifyParentPin(pin)
      if (result.success) {
        setMode({ type: 'closed' })
        router.push(ROUTES.PARENT.DASHBOARD)
      } else {
        setPinError(result.error ?? 'Incorrect PIN')
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setPinError(undefined); setMode({ type: 'select' }) }}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white/60 transition-colors"
        title="Switch profile"
      >
        👥
      </button>

      {/* Profile selection */}
      <Dialog open={mode.type === 'select'} onClose={() => setMode({ type: 'closed' })} title="Switch Profile">
        <div className="space-y-2">
          {siblings.map((sibling) => (
            <button
              key={sibling.id}
              type="button"
              onClick={() => handleSiblingSelect(sibling)}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left hover:bg-sprout-50 hover:border-sprout-200 transition-colors"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${AVATAR_BG[sibling.avatarColor] ?? AVATAR_BG.sprout}`}>
                {sibling.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-800">{sibling.name}</p>
                <p className="text-xs text-gray-400">Child{sibling.hasPin ? ' · PIN required' : ''}</p>
              </div>
              <span className="ml-auto text-gray-300">›</span>
            </button>
          ))}

          <div className="border-t border-gray-100 pt-2">
            <button
              type="button"
              onClick={() => { setPinError(undefined); setMode({ type: 'pin-parent' }) }}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm font-bold">
                👤
              </div>
              <div>
                <p className="font-medium text-gray-800">Parent</p>
                <p className="text-xs text-gray-400">Parent view · PIN required</p>
              </div>
              <span className="ml-auto text-gray-300">›</span>
            </button>
          </div>
        </div>
      </Dialog>

      {/* Child PIN dialog */}
      {mode.type === 'pin-child' && (
        <Dialog open={true} onClose={() => setMode({ type: 'closed' })} title={`Switch to ${mode.sibling.name}`}>
          <PinPad
            title={`Enter ${mode.sibling.name}'s PIN`}
            error={pinError}
            isLoading={isPending}
            onComplete={(pin) => handleChildPin(mode.sibling, pin)}
          />
        </Dialog>
      )}

      {/* Parent PIN dialog */}
      {mode.type === 'pin-parent' && (
        <Dialog open={true} onClose={() => setMode({ type: 'closed' })} title="Parent Access">
          <PinPad
            title="Enter parent PIN"
            subtitle="Switch to parent view"
            error={pinError}
            isLoading={isPending}
            onComplete={handleParentPin}
          />
        </Dialog>
      )}
    </>
  )
}

// ── Bottom nav ────────────────────────────────────────────────────────────────

function ChildNav({ childId }: { childId: string }) {
  const pathname = usePathname()

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

// ── Shell ─────────────────────────────────────────────────────────────────────

export default function ChildShell({
  children,
  childId,
  name,
  avatarColor,
  siblings,
  quickAccessEnabled,
}: ChildShellProps) {
  const colorClass = AVATAR_BG[avatarColor] ?? AVATAR_BG.sprout
  const [showTutorial, setShowTutorial] = useState(false)

  return (
    <div className="child-bg min-h-screen">
      <header className="sticky top-0 z-10 h-14 bg-white/80 backdrop-blur border-b border-sprout-100 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <CoinSproutLogo size={38} />
          <span className="font-bold text-sprout-700 text-lg tracking-tight">CoinSprout</span>
          {name && (
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${colorClass}`}>
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {quickAccessEnabled && <QuickProfileSwitcher siblings={siblings} />}
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button
            type="button"
            onClick={() => setShowTutorial(true)}
            className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-400 text-sm font-bold text-gray-600 hover:border-gray-600 hover:text-gray-800 hover:bg-white/60 transition-colors"
            title="Help"
          >
            ?
          </button>
          <BackToParentButton />
        </div>
      </header>

      {showTutorial && (
        <TutorialOverlay
          steps={childSteps}
          onComplete={() => setShowTutorial(false)}
          onSkip={()    => setShowTutorial(false)}
        />
      )}
      <main className="max-w-3xl mx-auto px-4 pb-24">
        {children}
      </main>
      <ChildNav childId={childId} />
    </div>
  )
}
