'use client'

import { TrendingUp, TrendingDown, Activity, Users } from 'lucide-react'
import { formatCurrency, formatPercentage, cn } from '@/lib/utils'

interface QuickStatsProps {
  marketData?: {
    totalUsers?: number
    marketStatus?: 'open' | 'closed'
    topGainer?: { symbol: string; change: number }
    topLoser?: { symbol: string; change: number }
  }
}

export default function QuickStats({ marketData }: QuickStatsProps) {
  const totalUsers = marketData?.totalUsers || 1247
  const marketStatus = marketData?.marketStatus || 'open'
  const topGainer = marketData?.topGainer || { symbol: 'TSLA', change: 3.21 }
  const topLoser = marketData?.topLoser || { symbol: 'TCS.NS', change: -1.23 }
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Market Overview</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className={cn(
              'w-3 h-3 rounded-full mr-2',
              marketStatus === 'open' ? 'bg-green-400' : 'bg-red-400'
            )}></div>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-400">Market Status</p>
          <p className={cn(
            'font-semibold',
            marketStatus === 'open' ? 'text-green-400' : 'text-red-400'
          )}>
            {marketStatus === 'open' ? 'Open' : 'Closed'}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-400">Active Traders</p>
          <p className="font-semibold text-white">{totalUsers.toLocaleString()}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-sm text-slate-400">Top Gainer</p>
          <p className="font-semibold text-white">{topGainer.symbol}</p>
          <p className="text-sm text-green-400">{formatPercentage(topGainer.change)}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-sm text-slate-400">Top Loser</p>
          <p className="font-semibold text-white">{topLoser.symbol}</p>
          <p className="text-sm text-red-400">{formatPercentage(topLoser.change)}</p>
        </div>
      </div>
    </div>
  )
}