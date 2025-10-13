'use client'

import { Wallet, TrendingUp, DollarSign, PieChart } from 'lucide-react'
import { formatCurrency, formatPercentage, cn } from '@/lib/utils'

interface PortfolioCardProps {
  balance: number
  portfolioValue: number
  totalPnL: number
  totalPnLPercentage: number
}

export default function PortfolioCard({ 
  balance, 
  portfolioValue, 
  totalPnL, 
  totalPnLPercentage 
}: PortfolioCardProps) {
  const totalValue = balance + portfolioValue
  const isProfit = totalPnL >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <Wallet className="h-6 w-6 text-purple-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-400">Cash Balance</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(balance)}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <PieChart className="h-6 w-6 text-purple-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-400">Holdings Value</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(portfolioValue)}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <DollarSign className="h-6 w-6 text-purple-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-400">Total Value</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6">
        <div className="flex items-center">
          <div className={cn(
            'p-2 rounded-lg',
            isProfit ? 'bg-green-600/20' : 'bg-red-600/20'
          )}>
            <TrendingUp className={cn(
              'h-6 w-6',
              isProfit ? 'text-green-400' : 'text-red-400'
            )} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-400">Total P&L</p>
            <p className={cn(
              'text-2xl font-bold',
              isProfit ? 'text-green-400' : 'text-red-400'
            )}>
              {isProfit ? '+' : ''}{formatCurrency(totalPnL)}
            </p>
            <p className={cn(
              'text-sm',
              isProfit ? 'text-green-400' : 'text-red-400'
            )}>
              ({formatPercentage(totalPnLPercentage)})
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}