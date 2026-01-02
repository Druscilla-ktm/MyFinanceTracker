"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Currency = {
  code: string
  symbol: string
  name: string
  rate: number // Exchange rate relative to USD
}

export const CURRENCIES: Currency[] = [
  { code: "UGX", symbol: "UGX", name: "Uganda Shilling", rate: 3700 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", rate: 129 },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling", rate: 2500 },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 780 },
  { code: "ZAR", symbol: "R", name: "South African Rand", rate: 18.5 },
]

type CurrencyContextType = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatAmount: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0]) // Default to UGX

  useEffect(() => {
    // Load saved currency from localStorage
    const saved = localStorage.getItem("selectedCurrency")
    if (saved) {
      const found = CURRENCIES.find((c) => c.code === saved)
      if (found) setCurrencyState(found)
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem("selectedCurrency", newCurrency.code)
  }

  const formatAmount = (amount: number) => {
    // Convert from USD base to selected currency
    const converted = amount * currency.rate

    // Format based on currency
    if (currency.code === "UGX" || currency.code === "KES" || currency.code === "TZS" || currency.code === "NGN") {
      // For currencies without decimals
      return `${currency.symbol} ${Math.round(converted).toLocaleString()}`
    } else {
      // For currencies with decimals
      return `${currency.symbol}${converted.toFixed(2)}`
    }
  }

  return <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider")
  }
  return context
}
