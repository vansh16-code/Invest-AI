'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react'
import { Stock } from '@/types'
import { formatCurrency, formatPercentage, cn } from '@/lib/utils'
import TradeModal from './TradeModal'

interface StockCardProps {
  stock: Stock
  onTradeSuccess?: () => void
}

export default function StockCard({ stock, onTradeSuccess }: StockCardProps) {
  const [showTradeModal, setShowTradeModal] = useState(false)
  const isPositive = stock.change >= 0

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6 hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-white">{stock.symbol}</h3>
            <p className="text-sm text-slate-400 truncate">{stock.name}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">
              {formatCurrency(stock.current_price)}
            </p>
            <div className={cn(
              'flex items-center text-sm font-medium',
              isPositive ? 'text-green-400' : 'text-red-400'
            )}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {formatPercentage(stock.change_percent)}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowTradeModal(true)}
          className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/25"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Trade</span>
        </button>
      </div>

      <TradeModal
        stock={stock}
        isOpen={showTradeModal}
        onClose={() => setShowTradeModal(false)}
        onTradeSuccess={onTradeSuccess}
      />
    </>
  )
}