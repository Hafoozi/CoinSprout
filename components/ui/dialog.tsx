'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
  open:     boolean
  onClose:  () => void
  title:    string
  children: React.ReactNode
}

export default function Dialog({ open, onClose, title, children }: DialogProps) {
  const panelRef  = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Focus panel when opened so screen readers announce it
  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  if (!open || !mounted) return null

  // Render into document.body so z-index is never trapped inside a
  // stacking context created by the sticky header or other ancestors.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="card-surface w-full max-w-md p-6 space-y-4 outline-none max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="dialog-title" className="text-lg font-bold text-sprout-800">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
