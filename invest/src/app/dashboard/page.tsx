'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Stock, Portfolio } from '@/types'
import { stockAPI, userAPI, marketAPI, handleApiError } from '@/lib/api'
import { calculatePnL } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import StockCard from '@/components/StockCard'
import PortfolioCard from '@/components/PortfolioCard'
import PortfolioTable from '@/components/PortfolioTable'
import QuickStats from '@/components/QuickStats'

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [stocks, setStocks] = useState<Stock[]>([])
  const [portfolio, setPortfolio] = useState<Portfolio[]>([])
  const [marketData, setMarketData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchData()
    }
  }, [authLoading, isAuthenticated])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const [stocksData, portfolioData, marketOverview] = await Promise.all([
        stockAPI.getStocks(),
        userAPI.getPortfolio(),
        marketAPI.getMarketOverview().catch(() => null) // Optional market data
      ])
      
      setStocks(stocksData)
      setPortfolio(portfolioData)
      setMarketData(marketOverview)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      const { error: errorMessage } = handleApiError(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.length > 2) {
      try {
        const searchResults = await stockAPI.searchStocks(term)
        setStocks(searchResults)
      } catch (error) {
        console.error('Search failed:', error)
      }
    } else if (term.length === 0) {
      fetchData() // Reload all stocks
    }
  }

  const filteredStocks = searchTerm.length <= 2 
    ? stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stocks

  // Calculate total P&L
  const totalPnL = portfolio.reduce((acc, holding) => {
    const { pnl } = calculatePnL(holding.current_price, holding.avg_price, holding.quantity)
    return acc + pnl
  }, 0)

  const totalInvested = portfolio.reduce((acc, holding) => {
    return acc + (holding.avg_price * holding.quantity)
  }, 0)

  const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  const portfolioValue = portfolio.reduce((acc, holding) => {
    return acc + (holding.current_price * holding.quantity)
  }, 0)

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-700 rounded"></div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchData}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-300">Welcome back, {user?.username}!</p>
        </div>

      <QuickStats marketData={marketData} />

      {user && (
        <PortfolioCard
          balance={user.balance}
          portfolioValue={portfolioValue}
          totalPnL={totalPnL}
          totalPnLPercentage={totalPnLPercentage}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Available Stocks</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {filteredStocks.map((stock) => (
              <StockCard 
                key={stock.symbol} 
                stock={stock} 
                onTradeSuccess={fetchData}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-white mb-4">Portfolio</h2>
          <PortfolioTable portfolio={portfolio} />
        </div>
      </div>
      </div>
    </div>
  )
}