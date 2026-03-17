'use client'

import { useState } from 'react'

interface PinPadProps {
  title: string
  subtitle?: string
  error?: string
  isLoading?: boolean
  onComplete: (pin: string) => void
}

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

export default function PinPad({ title, subtitle, error, isLoading, onComplete }: PinPadProps) {
  const [digits, setDigits] = useState<string[]>([])

  function handleKey(key: string) {
    if (isLoading) return
    if (key === '⌫') {
      setDigits((d) => d.slice(0, -1))
      return
    }
    if (key === '') return
    if (digits.length >= 4) return
    const next = [...digits, key]
    setDigits(next)
    if (next.length === 4) {
      onComplete(next.join(''))
      setDigits([])
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      <div className="text-center space-y-1">
        <p className="text-base font-semibold text-gray-800">{title}</p>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>

      {/* Dot indicators */}
      <div className="flex gap-4">
        {[0,1,2,3].map((i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full border-2 transition-colors ${
              i < digits.length
                ? 'bg-sprout-500 border-sprout-500'
                : 'border-gray-300 bg-white'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-3 w-64">
        {KEYS.map((key, i) => (
          <button
            key={i}
            type="button"
            disabled={key === '' || isLoading}
            onClick={() => handleKey(key)}
            className={`h-14 rounded-2xl text-xl font-medium transition-colors
              ${key === '' ? 'invisible' : ''}
              ${key === '⌫'
                ? 'bg-transparent text-gray-400 hover:text-gray-600 text-2xl'
                : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800'
              }
              disabled:opacity-50
            `}
          >
            {isLoading && key !== '⌫' && key !== '' ? (
              <span className="text-sm text-gray-400">···</span>
            ) : key}
          </button>
        ))}
      </div>
    </div>
  )
}
