export interface User {
  id: number
  username: string
  email: string
  balance: number
  is_active: boolean
  created_at: string
}

export interface Stock {
  id: number
  symbol: string
  name: string
  current_price: number
  change: number
  change_percent: number
  volume: number
  market_cap?: number
  sector?: string
  updated_at: string
}

export interface Portfolio {
  id: number
  user_id: number
  symbol: string
  quantity: number
  avg_price: number
  current_price: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: number
  user_id: number
  symbol: string
  quantity: number
  price: number
  total: number
  type: 'buy' | 'sell'
  created_at: string
}

export interface LeaderboardEntry {
  id: number
  username: string
  portfolio_value: number
  total_pnl: number
  total_pnl_percentage: number
  rank: number
}

export interface StockHistoryData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TradeRequest {
  symbol: string
  quantity: number
  type: 'buy' | 'sell'
  price: number
}

export interface AIExplanation {
  term: string
  explanation: string
  created_at: string
}

export interface MarketStatus {
  is_open: boolean
  next_open?: string
  next_close?: string
}

export interface MarketOverview {
  total_stocks: number
  market_cap: number
  volume: number
  top_gainers: Stock[]
  top_losers: Stock[]
}

export interface UserRank {
  rank: number
  total_users: number
  percentile: number
}

export interface MarketInsight {
  title: string
  content: string
  sentiment: string
  confidence: number
}

export interface PortfolioAnalysis {
  total_value: number
  total_pnl: number
  risk_score: number
  diversification_score: number
  recommendations: string[]
}