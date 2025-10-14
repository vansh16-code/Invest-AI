'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { LeaderboardEntry } from '@/types'
import { leaderboardAPI, handleApiError } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency, cn } from '@/lib/utils'

export default function Leaderboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchLeaderboard()
    }
  }, [authLoading, isAuthenticated])

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const [leaderboardData, userRankData] = await Promise.all([
        leaderboardAPI.getLeaderboard(10),
        leaderboardAPI.getUserRank().catch(() => null) // Optional user rank
      ])
      
      setLeaderboard(leaderboardData)
      setUserRank(userRankData)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      const { error: errorMessage } = handleApiError(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-gray-600">#{rank}</span>
          </div>
        )
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border-yellow-500/30'
      case 2:
        return 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-500/30'
      case 3:
        return 'bg-gradient-to-r from-amber-900/20 to-amber-800/20 border-amber-500/30'
      default:
        return 'bg-slate-800/30 border-slate-700/50'
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/25"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Trophy className="h-8 w-8 mr-3 text-purple-400" />
            Leaderboard
          </h1>
          <p className="text-slate-300 mt-2">See how you rank against other investors</p>
        </div>

      {/* Top 3 Podium */}
      <div className="mb-12">
        <div className="flex justify-center items-end space-x-4 mb-8">
          {/* Arrange podium as: 2nd, 1st, 3rd for visual effect */}
          {[1, 0, 2].map((leaderboardIndex, displayIndex) => {
            const entry = leaderboard[leaderboardIndex]
            if (!entry) return null
            
            const heights = ['h-32', 'h-40', 'h-24'] // 2nd, 1st, 3rd heights
            const bgColors = ['bg-slate-700/50', 'bg-slate-600/50', 'bg-slate-700/50']
            
            return (
              <div key={entry.id} className="text-center">
                <div className={cn(
                  'rounded-lg border-2 p-4 flex flex-col justify-end backdrop-blur-sm',
                  heights[displayIndex],
                  bgColors[displayIndex],
                  entry.rank === 1 ? 'border-yellow-500/50' :
                  entry.rank === 2 ? 'border-slate-400/50' : 'border-amber-500/50'
                )}>
                  <div className="mb-2">
                    {getRankIcon(entry.rank)}
                  </div>
                  <p className="font-bold text-white text-sm">{entry.username}</p>
                  <p className="text-xs text-slate-300">{formatCurrency(entry.portfolio_value)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/30">
          <h2 className="text-xl font-semibold text-white">Full Rankings</h2>
        </div>
        
        <div className="divide-y divide-slate-700/50">
          {leaderboard.map((entry) => (
            <div
              key={entry.id}
              className={cn(
                'px-6 py-4 flex items-center justify-between transition-colors hover:bg-slate-700/30',
                getRankBg(entry.rank)
              )}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12">
                  {getRankIcon(entry.rank)}
                </div>
                <div>
                  <p className="font-semibold text-white">{entry.username}</p>
                  <p className="text-sm text-slate-400">Rank #{entry.rank}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  {formatCurrency(entry.portfolio_value)}
                </p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Portfolio Value</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competition Info */}
      <div className="mt-8 bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-2">How Rankings Work</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <p>• Rankings are based on total portfolio value (cash + holdings)</p>
          <p>• Updated in real-time as you make trades</p>
          <p>• Everyone starts with ₹100,000 virtual money</p>
          <p>• Compete with other learners to reach the top!</p>
        </div>
      </div>
      </div>
    </div>
  )
}