"use client"
import { useCurrency, CURRENCIES } from "@/contexts/currency-context"
import { DollarSign } from "lucide-react"

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency()

  return (
    <div className="flex items-center gap-2">
      <DollarSign className="w-4 h-4 text-muted-foreground" />
      <select
        value={currency.code}
        onChange={(e) => {
          const selected = CURRENCIES.find((c) => c.code === e.target.value)
          if (selected) setCurrency(selected)
        }}
        className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code} - {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}
