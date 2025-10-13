'use client'

import { Trophy, Medal, Award } from 'lucide-react'
import { LeaderboardEntry } from '@/types'
import { formatCurrency, cn } from '@/lib/utils'

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[]
}

export default function LeaderboardCard({ leaderboard }: LeaderboardCardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
      default:
        return 'bg-white border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Leaderboard
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {leaderboard.map((entry) => (
          <div
            key={entry.username}
            className={cn(
              'px-6 py-4 flex items-center justify-between transition-colors hover:bg-gray-50',
              getRankBg(entry.rank)
            )}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10">
                {getRankIcon(entry.rank)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{entry.username}</p>
                <p className="text-sm text-gray-600">Rank #{entry.rank}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-gray-900">
                {formatCurrency(entry.portfolio_value)}
              </p>
              <p className="text-sm text-gray-600">Portfolio Value</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}