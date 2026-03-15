/**
 * Format a numeric dollar amount for display.
 * Examples: 5 → "$5.00", 1234.5 → "$1,234.50"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Parse a user-entered string into a numeric dollar amount.
 * Returns null if the input is not a valid positive number.
 */
export function parseCurrencyInput(value: string): number | null {
  const cleaned = value.replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  if (isNaN(parsed) || parsed < 0) return null
  return parseFloat(parsed.toFixed(2))
}
