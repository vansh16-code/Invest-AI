'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { aiAPI, handleApiError } from '@/lib/api'
import { Brain, TrendingUp, TrendingDown, AlertCircle, BarChart3, Shield, Target, Lightbulb } from 'lucide-react'
import { formatCurrency, formatPercentage, cn } from '@/lib/utils'

interface MarketInsight {
  title: string
  content: string
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
}

interface PortfolioAnalysis {
  total_value: number
  total_pnl: number
  total_pnl_percentage: number
  risk_score: number
  diversification_score: number
  recommendations: string[]
}

export default function AIInsightsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [insights, setInsights] = useState<MarketInsight[]>([])
  const [portfolioAnalysis, setPortfolioAnalysis] = useState<PortfolioAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchAIData()
    }
  }, [isAuthenticated])

  const fetchAIData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const [insightsData, analysisData] = await Promise.all([
        aiAPI.getMarketInsights(),
        aiAPI.analyzePortfolio()
      ])
      
      setInsights(insightsData)
      setPortfolioAnalysis(analysisData)
    } catch (error) {
      console.error('Failed to fetch AI data:', error)
      const { error: errorMessage } = handleApiError(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-green-400" />
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'border-green-500/30 bg-green-500/10'
      case 'negative':
        return 'border-red-500/30 bg-red-500/10'
      default:
        return 'border-yellow-500/30 bg-yellow-500/10'
    }
  }

  const getRiskColor = (score: number) => {
    if (score <= 0.3) return 'text-green-400'
    if (score <= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRiskLabel = (score: number) => {
    if (score <= 0.3) return 'Low Risk'
    if (score <= 0.6) return 'Medium Risk'
    return 'High Risk'
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-2">AI is analyzing...</h2>
            <p className="text-slate-300">Generating insights and portfolio analysis</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading AI Insights</h2>
            <p className="text-slate-300 mb-4">{error}</p>
            <button
              onClick={fetchAIData}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Brain className="h-8 w-8 text-purple-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">AI Insights</h1>
          </div>
          <p className="text-slate-300">
            Get AI-powered market insights and personalized portfolio analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Insights */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Lightbulb className="h-6 w-6 text-yellow-400 mr-2" />
              Market Insights
            </h2>
            
            {insights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border p-6",
                  getSentimentColor(insight.sentiment)
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    {getSentimentIcon(insight.sentiment)}
                    <span className="ml-2">{insight.title}</span>
                  </h3>
                  <div className="text-sm text-slate-400">
                    {Math.round(insight.confidence * 100)}% confidence
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">{insight.content}</p>
              </div>
            ))}
          </div>

          {/* Portfolio Analysis */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-400 mr-2" />
              Portfolio Analysis
            </h2>

            {portfolioAnalysis && (
              <>
                {/* Portfolio Metrics */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Portfolio Metrics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-400">Total Value</p>
                      <p className="text-xl font-bold text-white">
                        {formatCurrency(portfolioAnalysis.total_value)}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-slate-400">Total P&L</p>
                      <p className={cn(
                        "text-xl font-bold",
                        portfolioAnalysis.total_pnl >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {portfolioAnalysis.total_pnl >= 0 ? "+" : ""}{formatCurrency(portfolioAnalysis.total_pnl)}
                      </p>
                      <p className={cn(
                        "text-sm",
                        portfolioAnalysis.total_pnl >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        ({formatPercentage(portfolioAnalysis.total_pnl_percentage)})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risk & Diversification */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-slate-400 mr-2" />
                        <span className="text-slate-300">Risk Score</span>
                      </div>
                      <div className="text-right">
                        <span className={cn("font-bold", getRiskColor(portfolioAnalysis.risk_score))}>
                          {getRiskLabel(portfolioAnalysis.risk_score)}
                        </span>
                        <p className="text-sm text-slate-400">
                          {Math.round(portfolioAnalysis.risk_score * 100)}/100
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 text-slate-400 mr-2" />
                        <span className="text-slate-300">Diversification</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-blue-400">
                          {Math.round(portfolioAnalysis.diversification_score * 100)}%
                        </span>
                        <p className="text-sm text-slate-400">
                          {portfolioAnalysis.diversification_score >= 0.7 ? "Well Diversified" : 
                           portfolioAnalysis.diversification_score >= 0.4 ? "Moderately Diversified" : "Needs Diversification"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
                  
                  <div className="space-y-3">
                    {portfolioAnalysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-slate-300 text-sm leading-relaxed">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchAIData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center mx-auto"
          >
            <Brain className="h-5 w-5 mr-2" />
            Refresh AI Analysis
          </button>
        </div>
      </div>
    </div>
  )
}