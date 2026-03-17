'use client'

import { clsx } from 'clsx'
import { formatCurrency } from '@/lib/utils/currency'
import { useCurrency } from '@/components/providers/currency-provider'

interface MoneyAmountProps {
  amount:    number
  size?:     'sm' | 'md' | 'lg' | 'xl'
  showSign?: boolean
  className?: string
}

export default function MoneyAmount({ amount, size = 'md', showSign = false, className }: MoneyAmountProps) {
  const currency  = useCurrency()
  const formatted = formatCurrency(Math.abs(amount), currency)
  const sign      = showSign && amount !== 0 ? (amount > 0 ? '+' : '−') : ''

  return (
    <span
      className={clsx(
        'money font-bold tabular-nums',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-xl',
        size === 'xl' && 'text-3xl',
        showSign && amount > 0 && 'text-sprout-600',
        showSign && amount < 0 && 'text-red-500',
        className
      )}
    >
      {sign}{formatted}
    </span>
  )
}
