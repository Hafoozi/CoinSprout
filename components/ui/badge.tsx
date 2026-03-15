import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'red' | 'gold' | 'gray'
}

export default function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variant === 'green' && 'bg-sprout-100 text-sprout-700',
        variant === 'red'   && 'bg-red-100 text-red-700',
        variant === 'gold'  && 'bg-gold-100 text-gold-700',
        variant === 'gray'  && 'bg-gray-100 text-gray-600'
      )}
    >
      {children}
    </span>
  )
}
