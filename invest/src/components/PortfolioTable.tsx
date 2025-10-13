'use client'

import { Portfolio } from '@/types'
import { formatCurrency, formatPercentage, calculatePnL, cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PortfolioTableProps {
  portfolio: Portfolio[]
}

export default function PortfolioTable({ portfolio }: PortfolioTableProps) {
  if (portfolio.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-4 sm:p-8 text-center">
        <p className="text-slate-400">No holdings yet. Start trading to build your portfolio!</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-slate-700/50 bg-slate-800/30">
        <h3 className="text-lg font-semibold text-white">Your Holdings</h3>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Avg Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Current Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                P&L
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {portfolio.map((holding) => {
              const { pnl, pnlPercentage, currentValue } = calculatePnL(
                holding.current_price,
                holding.avg_price,
                holding.quantity
              )
              const isProfit = pnl >= 0

              return (
                <tr key={holding.symbol} className="hover:bg-slate-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-white">{holding.symbol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {holding.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {formatCurrency(holding.avg_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {formatCurrency(holding.current_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {formatCurrency(currentValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn(
                      'flex items-center',
                      isProfit ? 'text-green-400' : 'text-red-400'
                    )}>
                      {isProfit ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <div>
                        <div className="font-medium">{formatCurrency(Math.abs(pnl))}</div>
                        <div className="text-sm">({formatPercentage(pnlPercentage)})</div>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-slate-700/50">
        {portfolio.map((holding) => {
          const { pnl, pnlPercentage, currentValue } = calculatePnL(
            holding.current_price,
            holding.avg_price,
            holding.quantity
          )
          const isProfit = pnl >= 0

          return (
            <div key={holding.symbol} className="p-4 hover:bg-slate-700/30">
              {/* Header with Symbol and P&L */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-white text-lg">{holding.symbol}</h4>
                  <p className="text-slate-400 text-sm">{holding.quantity} shares</p>
                </div>
                <div className={cn(
                  'flex items-center text-right',
                  isProfit ? 'text-green-400' : 'text-red-400'
                )}>
                  {isProfit ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <div>
                    <div className="font-medium">{formatCurrency(Math.abs(pnl))}</div>
                    <div className="text-sm">({formatPercentage(pnlPercentage)})</div>
                  </div>
                </div>
              </div>

              {/* Price Information Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400 uppercase tracking-wide text-xs">Current Price</p>
                  <p className="text-white font-medium">{formatCurrency(holding.current_price)}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide text-xs">Current Value</p>
                  <p className="text-white font-medium">{formatCurrency(currentValue)}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide text-xs">Avg Price</p>
                  <p className="text-white font-medium">{formatCurrency(holding.avg_price)}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide text-xs">P&L</p>
                  <p className={cn(
                    'font-medium',
                    isProfit ? 'text-green-400' : 'text-red-400'
                  )}>
                    {formatCurrency(Math.abs(pnl))} ({formatPercentage(pnlPercentage)})
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}