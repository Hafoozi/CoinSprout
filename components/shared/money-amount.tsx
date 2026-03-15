import { clsx } from 'clsx'
import { formatCurrency } from '@/lib/utils/currency'

interface MoneyAmountProps {
  amount: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSign?: boolean
  className?: string
}

// TODO: Wire up formatCurrency once lib/utils/currency.ts is implemented
export default function MoneyAmount({ amount, size = 'md', showSign = false, className }: MoneyAmountProps) {
  const formatted = `$${Math.abs(amount).toFixed(2)}`
  const sign = showSign && amount !== 0 ? (amount > 0 ? '+' : '−') : ''

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
