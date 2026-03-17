import type { CurrencySymbol } from '@/types/database'

export const DEFAULT_CURRENCY: CurrencySymbol = '$'

export const CURRENCY_OPTIONS: Array<{ symbol: CurrencySymbol; label: string }> = [
  { symbol: '$',  label: 'Dollar (USD / CAD / AUD)' },
  { symbol: '£',  label: 'Pound (GBP)'              },
  { symbol: '€',  label: 'Euro (EUR)'               },
  { symbol: '¥',  label: 'Yen / Yuan (JPY / CNY)'   },
  { symbol: '₹',  label: 'Rupee (INR)'              },
  { symbol: '₩',  label: 'Won (KRW)'                },
  { symbol: 'Fr', label: 'Franc (CHF)'              },
]
