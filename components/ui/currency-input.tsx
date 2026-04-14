'use client'

import { useState, useEffect, useCallback } from 'react'
import Dialog from '@/components/ui/dialog'

const KEYS = ['1','2','3','4','5','6','7','8','9','.','0','⌫']

interface Props {
  name: string
  id?: string
  label?: string
  /** Symbol shown before the value, e.g. "$" */
  prefix?: string
  /** Symbol shown after the value, e.g. "%" */
  suffix?: string
  placeholder?: string
  required?: boolean
  error?: string
  /** Max digits allowed before the decimal point (default: 6 → up to 999 999) */
  maxLength?: number
  /** Initial value (uncontrolled mode) */
  defaultValue?: number | string
  /** Current value (controlled mode — pair with onChange) */
  value?: string
  onChange?: (value: string) => void
}

export default function CurrencyInput({
  name,
  id,
  label,
  prefix,
  suffix,
  placeholder = '0.00',
  required,
  error,
  maxLength = 6,
  defaultValue,
  value: externalValue,
  onChange,
}: Props) {
  const isControlled = externalValue !== undefined

  const [internalValue, setInternalValue] = useState<string>(
    defaultValue !== undefined ? String(defaultValue) : ''
  )

  const value = isControlled ? externalValue : internalValue

  const [open, setOpen] = useState(false)

  const updateValue = useCallback(function updateValue(v: string) {
    if (!isControlled) setInternalValue(v)
    onChange?.(v)
  }, [isControlled, onChange])

  const handleKey = useCallback(function handleKey(key: string) {
    if (key === '⌫') {
      updateValue(value.slice(0, -1))
      return
    }
    if (key === '.') {
      if (value.includes('.')) return
      updateValue(value === '' ? '0.' : value + '.')
      return
    }
    const next = value + key
    // Max 2 decimal places
    const dotIdx = next.indexOf('.')
    if (dotIdx !== -1 && next.length - dotIdx - 1 > 2) return
    // Max digits before decimal
    const intPart = dotIdx !== -1 ? next.slice(0, dotIdx) : next
    if (intPart.length > maxLength) return
    // Prevent double-leading-zero (allow "0.")
    if (next.length > 1 && next[0] === '0' && next[1] !== '.') return
    updateValue(next)
  }, [value, updateValue, maxLength])

  const handleDone = useCallback(function handleDone() {
    const cleaned = value.endsWith('.') ? value.slice(0, -1) : value
    if (cleaned !== value) updateValue(cleaned)
    setOpen(false)
  }, [value, updateValue])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key >= '0' && e.key <= '9') { handleKey(e.key); return }
      if (e.key === '.')                 { handleKey('.'); return }
      if (e.key === 'Backspace')         { handleKey('⌫'); return }
      if (e.key === 'Enter')             { handleDone(); return }
      if (e.key === 'Escape')            { handleDone(); return }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, handleKey, handleDone])

  const isEmpty = value === ''

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Hidden input carries value into the form */}
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
      />

      {/* Tappable display — opens number pad */}
      <button
        type="button"
        id={id}
        onClick={() => setOpen(true)}
        className={[
          'w-full rounded-xl border bg-white px-3 py-2 text-sm text-left flex items-center gap-1.5 transition-colors',
          'focus:outline-none focus:ring-2',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
            : 'border-gray-200 hover:border-gray-300 focus:border-sprout-400 focus:ring-sprout-200',
        ].join(' ')}
      >
        {prefix && <span className="text-gray-500 shrink-0">{prefix}</span>}
        <span className={`flex-1 ${isEmpty ? 'text-gray-400' : 'text-gray-800'}`}>
          {isEmpty ? placeholder : value}
        </span>
        {suffix && <span className="text-gray-400 text-xs shrink-0">{suffix}</span>}
      </button>
      {error && <p className="text-xs text-red-500 break-words">{error}</p>}

      <Dialog
        open={open}
        onClose={handleDone}
        title={label ?? 'Enter amount'}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Value display */}
          <div className="w-full rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex items-center min-h-[56px]">
            <div className="flex-1 flex items-center justify-center gap-1">
              {prefix && <span className="text-xl text-gray-400">{prefix}</span>}
              <span className={`text-3xl font-bold tracking-tight ${isEmpty ? 'text-gray-300' : 'text-gray-800'}`}>
                {isEmpty ? '0.00' : value}
              </span>
              {suffix && <span className="text-xl text-gray-400 ml-1">{suffix}</span>}
            </div>
            {!isEmpty && (
              <button
                type="button"
                onClick={() => updateValue('')}
                className="ml-2 text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-gray-200"
              >
                C
              </button>
            )}
          </div>

          {/* Number pad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[248px]">
            {KEYS.map((key, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleKey(key)}
                className={[
                  'h-14 rounded-2xl text-xl font-medium transition-all active:scale-95 select-none',
                  key === '⌫'
                    ? 'text-gray-400 hover:text-gray-600 text-2xl'
                    : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800',
                ].join(' ')}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDone}
            className="w-full rounded-xl bg-sprout-500 hover:bg-sprout-600 text-white font-bold py-3 text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </Dialog>
    </div>
  )
}
