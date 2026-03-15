import { clsx } from 'clsx'

interface ProgressProps {
  value: number // 0–100
  className?: string
  color?: 'green' | 'gold'
}

export default function Progress({ value, className, color = 'green' }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={clsx('h-2 w-full bg-gray-100 rounded-full overflow-hidden', className)}>
      <div
        className={clsx(
          'h-full rounded-full transition-all duration-500',
          color === 'green' && 'bg-sprout-400',
          color === 'gold'  && 'bg-gold-400'
        )}
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}
