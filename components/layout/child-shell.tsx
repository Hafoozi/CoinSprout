'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Dialog from '@/components/ui/dialog'
import PinPad from '@/components/ui/pin-pad'
import { verifyParentPin } from '@/actions/profile-switch'
import { ROUTES } from '@/lib/constants/routes'

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

export default function ChildShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="child-bg min-h-screen">
      <header className="sticky top-0 z-10 h-14 bg-white/80 backdrop-blur border-b border-sprout-100 flex items-center justify-between px-4">
        <span className="font-bold text-sprout-700 text-lg tracking-tight">🌱 CoinSprout</span>
        <BackToParentButton />
      </header>
      <main className="max-w-3xl mx-auto px-4 pb-10">
        {children}
      </main>
    </div>
  )
}
