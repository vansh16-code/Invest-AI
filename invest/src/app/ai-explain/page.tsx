'use client'

import { useState } from 'react'
import { Search, Brain, Loader2, HelpCircle } from 'lucide-react'
import { aiAPI, handleApiError } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

const popularTerms = [
  'P/E Ratio', 'Market Cap', 'Dividend', 'Bull Market', 'Bear Market',
  'Volatility', 'Liquidity', 'ROE', 'EPS', 'Beta',
  'Dollar Cost Averaging', 'Diversification', 'Day Trading', 'Buy and Hold',
  'Stop Loss', 'Market Order', 'Limit Order', 'Short Selling'
]

export default function AIExplain() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [explanation, setExplanation] = useState<{ term: string; explanation: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const handleExplain = async (term: string) => {
    if (!term.trim()) return

    setIsLoading(true)
    setError(null)
    
    try {
      const result = await aiAPI.explainTerm(term)
      setExplanation(result)
      
      // Add to search history (avoid duplicates)
      setSearchHistory(prev => {
        const filtered = prev.filter(t => t.toLowerCase() !== term.toLowerCase())
        return [term, ...filtered].slice(0, 10) // Keep last 10 searches
      })
    } catch (error) {
      console.error('Failed to get AI explanation:', error)
      const { error: errorMessage } = handleApiError(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleExplain(searchTerm)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">AI Financial Assistant</h2>
          <p className="text-slate-300 mb-6">Please log in to access AI explanations</p>
          <a
            href="/login"
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/25"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">AI Financial Assistant</h1>
          <p className="text-slate-300 mt-2">Get instant explanations for any financial term or concept</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter a financial term (e.g., P/E Ratio, Market Cap, Bull Market...)"
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg text-white placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !searchTerm.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Explain'
              )}
            </button>
          </div>
        </form>

        {/* Popular Terms */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Popular Financial Terms</h2>
          <div className="flex flex-wrap gap-2">
            {popularTerms.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchTerm(term)
                  handleExplain(term)
                }}
                className="px-3 py-2 bg-slate-700/50 text-slate-300 rounded-md hover:bg-slate-600/50 transition-colors text-sm border border-slate-600/50"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(term)
                    handleExplain(term)
                  }}
                  className="px-3 py-2 bg-slate-800/50 text-slate-400 rounded-md hover:bg-slate-700/50 transition-colors text-sm border border-slate-700/50"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700/50 rounded-lg p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Explanation Result */}
        {explanation && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-purple-400 mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-3">{explanation.term}</h3>
                <p className="text-slate-300 leading-relaxed">{explanation.explanation}</p>
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-400 flex items-center">
                    <Brain className="h-3 w-3 mr-1" />
                    Powered by AI
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Getting Started */}
        {!explanation && !isLoading && (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">How it works</h3>
            <p className="text-slate-300 max-w-md mx-auto">
              Type any financial term or concept in the search box above, or click on one of the popular terms to get an instant AI-powered explanation.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}