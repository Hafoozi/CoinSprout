import { clsx } from 'clsx'

// TODO: Expand with full variant/size system as needed
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-colors',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        variant === 'primary'   && 'bg-sprout-500 text-white hover:bg-sprout-600 disabled:opacity-50',
        variant === 'secondary' && 'bg-sprout-100 text-sprout-700 hover:bg-sprout-200',
        variant === 'ghost'     && 'bg-transparent text-sprout-700 hover:bg-sprout-50',
        variant === 'danger'    && 'bg-red-500 text-white hover:bg-red-600',
        className
      )}
      {...props}
    >
      {isLoading ? 'Loading…' : children}
    </button>
  )
}
