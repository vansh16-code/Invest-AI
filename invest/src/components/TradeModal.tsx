'use client'

import { useState } from 'react'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import { Stock } from '@/types'
import { formatCurrency, cn } from '@/lib/utils'
import { userAPI, handleApiError } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface TradeModalProps {
  stock: Stock
  isOpen: boolean
  onClose: () => void
  onTradeSuccess?: () => void
}

export default function TradeModal({ stock, isOpen, onClose, onTradeSuccess }: TradeModalProps) {
  const { refreshUser } = useAuth()
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const totalCost = stock.current_price * quantity

  const handleTrade = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await userAPI.trade({
        symbol: stock.symbol,
        quantity,
        type: tradeType,
        price: stock.current_price
      })

      // Refresh user data to update balance
      await refreshUser()

      // Call success callback to refresh dashboard data
      if (onTradeSuccess) {
        onTradeSuccess()
      }

      onClose()

      // Show success message
      alert(`Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${quantity} shares of ${stock.symbol}`)
    } catch (error) {
      console.error('Trade failed:', error)
      const { error: errorMessage } = handleApiError(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md mx-4 border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Trade {stock.symbol}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">{stock.name}</span>
            <span className="text-lg font-bold text-white">{formatCurrency(stock.current_price)}</span>
          </div>
          <div className={cn(
            'flex items-center text-sm',
            stock.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
          )}>
            {stock.change_percent >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Trade Type
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setTradeType('buy')}
                className={cn(
                  'flex-1 py-2 px-4 rounded-md font-medium transition-colors',
                  tradeType === 'buy'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                )}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeType('sell')}
                className={cn(
                  'flex-1 py-2 px-4 rounded-md font-medium transition-colors',
                  tradeType === 'sell'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                )}
              >
                Sell
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="bg-slate-700/30 p-4 rounded-md border border-slate-600/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Total {tradeType === 'buy' ? 'Cost' : 'Value'}:</span>
              <span className="text-lg font-bold text-white">
                {formatCurrency(totalCost)}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700/50 rounded-md p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <button
            onClick={handleTrade}
            disabled={isLoading}
            className={cn(
              'w-full py-3 px-4 rounded-md font-medium transition-colors shadow-lg shadow-purple-500/25',
              'bg-purple-600 hover:bg-purple-700 text-white',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${quantity} Shares`}
          </button>
        </div>
      </div>
    </div>
  )
}