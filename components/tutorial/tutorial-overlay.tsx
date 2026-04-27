'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [idx,       setIdx]       = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [mounted,   setMounted]   = useState(false)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onSkip() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onSkip])

  if (!mounted) return null

  const step    = steps[idx]
  const isFirst = idx === 0
  const isLast  = idx === steps.length - 1

  function advance() {
    if (isLast) { onComplete(); return }
    setDirection('forward')
    setIdx(i => i + 1)
  }

  function retreat() {
    if (isFirst) return
    setDirection('back')
    setIdx(i => i - 1)
  }

  function jumpTo(i: number) {
    setDirection(i > idx ? 'forward' : 'back')
    setIdx(i)
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (dx < -50) advance()
    else if (dx > 50) retreat()
  }

  const stepAnimClass = direction === 'forward' ? 'tutorial-step-forward' : 'tutorial-step-back'

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6 bg-black/60 backdrop-blur-sm">
      <div
        className="tutorial-enter w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {/* ── Gradient header: step counter + title + skip ── */}
        <div className="bg-gradient-to-br from-sprout-500 to-sprout-600 px-5 pt-5 pb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-white/60 tracking-widest uppercase">
              {idx + 1} of {steps.length}
            </span>
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 transition-colors"
            >
              Skip ✕
            </button>
          </div>
          <h2 className="text-xl font-bold text-white leading-snug">{step.title}</h2>
        </div>

        {/* ── Animated content (slides on step change) ── */}
        <div key={`${idx}-${direction}`} className={stepAnimClass}>

          {/* Mockup area */}
          {step.mockup && (
            <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-b from-sprout-50 to-white border border-sprout-100 p-4 overflow-hidden">
              {step.mockup}
            </div>
          )}

          {/* Body text */}
          <div className={`px-5 pb-2 ${step.mockup ? 'pt-3' : 'pt-5'}`}>
            <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
          </div>
        </div>

        {/* ── Progress dots (clickable) ── */}
        <div className="flex justify-center gap-2 py-3">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => jumpTo(i)}
              aria-label={`Go to step ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx
                  ? 'w-6 bg-sprout-500'
                  : i < idx
                  ? 'w-1.5 bg-sprout-300'
                  : 'w-1.5 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center justify-between px-5 pb-7">
          <button
            type="button"
            onClick={retreat}
            disabled={isFirst}
            className="text-sm font-semibold text-gray-400 hover:text-gray-600 disabled:opacity-0 transition-colors"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={advance}
            className="rounded-2xl bg-sprout-500 hover:bg-sprout-600 active:bg-sprout-700 text-white font-bold px-6 py-2.5 text-sm transition-colors shadow-md shadow-sprout-200"
          >
            {isLast ? 'Done 🎉' : 'Next →'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}
