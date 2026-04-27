'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export interface TutorialStep {
  id:      string
  title:   string
  body:    string
  mockup?: React.ReactNode
}

interface Props {
  steps:      TutorialStep[]
  onComplete: () => void
  onSkip:     () => void
}

export default function TutorialOverlay({ steps, onComplete, onSkip }: Props) {
  const [idx,     setIdx]     = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Scroll lock while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Escape key → skip
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onSkip() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onSkip])

  if (!mounted) return null

  const step    = steps[idx]
  const isFirst = idx === 0
  const isLast  = idx === steps.length - 1

  function next() { isLast ? onComplete() : setIdx(i => i + 1) }
  function back() { if (!isFirst) setIdx(i => i - 1) }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="card-surface w-full max-w-sm outline-none overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5">
          <span className="text-xs font-medium text-gray-400">
            {idx + 1} of {steps.length}
          </span>
          <button
            onClick={onSkip}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip ✕
          </button>
        </div>

        {/* Mockup */}
        {step.mockup && (
          <div className="mx-5 mt-4 rounded-2xl bg-sprout-50 p-4 overflow-hidden">
            {step.mockup}
          </div>
        )}

        {/* Text */}
        <div className="px-5 pt-4 pb-2 space-y-1.5">
          <h2 className="text-lg font-bold text-sprout-800">{step.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 py-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? 'w-4 bg-sprout-500' : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-5 pb-5">
          <button
            onClick={back}
            disabled={isFirst}
            className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-0 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={next}
            className="rounded-xl bg-sprout-500 hover:bg-sprout-600 text-white font-bold px-5 py-2 text-sm transition-colors"
          >
            {isLast ? 'Finish 🎉' : 'Next →'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}
