'use client'

import { createContext, useContext } from 'react'
import { DEFAULT_CURRENCY } from '@/lib/constants/currencies'
import type { CurrencySymbol } from '@/types/database'

const CurrencyContext = createContext<CurrencySymbol>(DEFAULT_CURRENCY)

export function CurrencyProvider({
  symbol,
  children,
}: {
  symbol: string
  children: React.ReactNode
}) {
  return (
    <CurrencyContext.Provider value={(symbol as CurrencySymbol) || DEFAULT_CURRENCY}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency(): CurrencySymbol {
  return useContext(CurrencyContext)
}
