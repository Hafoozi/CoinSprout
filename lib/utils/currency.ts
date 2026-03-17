import { DEFAULT_CURRENCY } from '@/lib/constants/currencies'

const numberFmt = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Format a numeric amount for display using the given currency symbol.
 * Examples: (1234.5, '$') → "$1,234.50"  (1234.5, '£') → "£1,234.50"
 */
export function formatCurrency(amount: number, symbol: string = DEFAULT_CURRENCY): string {
  return symbol + numberFmt.format(amount)
}

/**
 * Parse a user-entered string into a numeric amount.
 * Returns null if the input is not a valid positive number.
 */
export function parseCurrencyInput(value: string): number | null {
  const cleaned = value.replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  if (isNaN(parsed) || parsed < 0) return null
  return parseFloat(parsed.toFixed(2))
}
