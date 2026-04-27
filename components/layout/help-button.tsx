'use client'

import { useState, useEffect, useRef } from 'react'
import TutorialOverlay from '@/components/tutorial/tutorial-overlay'
import { parentSteps } from '@/components/tutorial/parent-steps'
import { childSteps } from '@/components/tutorial/child-steps'

interface ChildOption {
  id:   string
  name: string
}

interface Props {
  userId:   string
  children: ChildOption[]
}

type TutorialMode =
  | { type: 'closed' }
  | { type: 'parent' }
  | { type: 'child'; childId: string }

export default function HelpButton({ children }: Props) {
  const [open,     setOpen]     = useState(false)
  const [tutorial, setTutorial] = useState<TutorialMode>({ type: 'closed' })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [open])

  function startTutorial(mode: TutorialMode) {
    setOpen(false)
    setTutorial(mode)
  }

  return (
    <>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-400 text-sm font-bold text-gray-600 hover:border-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          title="Help & tutorials"
        >
          ?
        </button>

        {open && (
          <div className="absolute right-0 top-10 z-50 w-52 rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden py-1">
            <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Tutorials
            </p>

            <button
              type="button"
              onClick={() => startTutorial({ type: 'parent' })}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-sprout-50 transition-colors"
            >
              <span>▶</span> Parent Tour
            </button>

            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => startTutorial({ type: 'child', childId: child.id })}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-sprout-50 transition-colors"
              >
                <span>▶</span> {child.name}&apos;s Tour
              </button>
            ))}

            <div className="my-1 border-t border-gray-100" />

            <a
              href="mailto:toadgranola+coinsprout@gmail.com"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-sprout-50 transition-colors"
            >
              <span>✉</span> Contact Us
            </a>
          </div>
        )}
      </div>

      {tutorial.type === 'parent' && (
        <TutorialOverlay
          steps={parentSteps}
          onComplete={() => setTutorial({ type: 'closed' })}
          onSkip={()    => setTutorial({ type: 'closed' })}
        />
      )}
      {tutorial.type === 'child' && (
        <TutorialOverlay
          steps={childSteps}
          onComplete={() => setTutorial({ type: 'closed' })}
          onSkip={()    => setTutorial({ type: 'closed' })}
        />
      )}
    </>
  )
}
