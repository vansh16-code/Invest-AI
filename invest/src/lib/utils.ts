import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function calculatePnL(currentPrice: number, avgPrice: number, quantity: number) {
  const currentValue = currentPrice * quantity
  const investedValue = avgPrice * quantity
  const pnl = currentValue - investedValue
  const pnlPercentage = ((currentPrice - avgPrice) / avgPrice) * 100
  
  return {
    pnl,
    pnlPercentage,
    currentValue,
    investedValue
  }
}