'use client'

import { BookOpen, TrendingUp, DollarSign, PieChart, BarChart3, Target } from 'lucide-react'
import AIExplainBox from '@/components/AIExplainBox'

const concepts = [
  {
    title: 'Stock Basics',
    icon: TrendingUp,
    items: [
      { term: 'Stock', description: 'A share in the ownership of a company' },
      { term: 'Share Price', description: 'The current market value of one share' },
      { term: 'Market Cap', description: 'Total value of all company shares' },
      { term: 'Volume', description: 'Number of shares traded in a period' },
    ]
  },
  {
    title: 'Financial Metrics',
    icon: BarChart3,
    items: [
      { term: 'P/E Ratio', description: 'Price-to-Earnings ratio for valuation' },
      { term: 'Dividend', description: 'Payment made to shareholders from profits' },
      { term: 'EPS', description: 'Earnings Per Share - company profit per share' },
      { term: 'ROE', description: 'Return on Equity - profitability measure' },
    ]
  },
  {
    title: 'Market Concepts',
    icon: PieChart,
    items: [
      { term: 'Bull Market', description: 'Period of rising stock prices' },
      { term: 'Bear Market', description: 'Period of falling stock prices' },
      { term: 'Volatility', description: 'Measure of price fluctuation' },
      { term: 'Liquidity', description: 'How easily a stock can be bought/sold' },
    ]
  },
  {
    title: 'Trading Strategies',
    icon: Target,
    items: [
      { term: 'Buy and Hold', description: 'Long-term investment strategy' },
      { term: 'Day Trading', description: 'Buying and selling within the same day' },
      { term: 'Dollar Cost Averaging', description: 'Investing fixed amounts regularly' },
      { term: 'Diversification', description: 'Spreading investments across different assets' },
    ]
  }
]

const tips = [
  {
    title: 'Start Small',
    description: 'Begin with small amounts and gradually increase as you gain experience.',
    icon: DollarSign
  },
  {
    title: 'Do Your Research',
    description: 'Always research companies before investing. Understand their business model.',
    icon: BookOpen
  },
  {
    title: 'Stay Diversified',
    description: 'Don\'t put all your money in one stock. Spread your risk across different sectors.',
    icon: PieChart
  },
  {
    title: 'Think Long-term',
    description: 'The stock market rewards patience. Focus on long-term growth rather than quick gains.',
    icon: TrendingUp
  }
]

export default function Learn() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Learn Investing</h1>
          <p className="text-slate-300 mt-2">Master the fundamentals of stock market investing</p>
        </div>

        {/* Investment Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Investment Tips for Beginners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip) => {
              const Icon = tip.icon
              return (
                <div key={tip.title} className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                  <p className="text-slate-300 text-sm">{tip.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Financial Concepts */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Key Financial Concepts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {concepts.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.title} className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mr-3">
                      <Icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                  </div>

                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <div key={item.term} className="border-l-4 border-purple-500/30 pl-4">
                        <div className="flex items-center justify-between">
                          <AIExplainBox term={item.term}>
                            <span className="font-medium text-white">{item.term}</span>
                          </AIExplainBox>
                        </div>
                        <p className="text-sm text-slate-300 mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Learning Workflow */}
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700/50 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Your Learning Journey</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Learn Basics</h3>
              <p className="text-slate-300 text-sm">Understand key financial concepts and terminology</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Practice Trading</h3>
              <p className="text-slate-300 text-sm">Use virtual money to practice buying and selling stocks</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analyze Performance</h3>
              <p className="text-slate-300 text-sm">Track your portfolio and learn from your decisions</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Compete & Improve</h3>
              <p className="text-slate-300 text-sm">Compare with others and continuously improve your skills</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/ai-explain"
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-600/50 transition-colors text-center"
            >
              <h4 className="text-white font-semibold mb-2">🤖 Ask AI</h4>
              <p className="text-slate-300 text-sm">Get instant explanations for any financial term</p>
            </a>
            
            <a
              href="/dashboard"
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-600/50 transition-colors text-center"
            >
              <h4 className="text-white font-semibold mb-2">📊 Start Trading</h4>
              <p className="text-slate-300 text-sm">Practice with ₹100,000 virtual money</p>
            </a>
            
            <a
              href="/leaderboard"
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-600/50 transition-colors text-center"
            >
              <h4 className="text-white font-semibold mb-2">🏆 View Rankings</h4>
              <p className="text-slate-300 text-sm">See how you compare with other learners</p>
            </a>
          </div>
        </div>

        {/* Learning Tips */}
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700/50">
          <h2 className="text-2xl font-semibold text-white mb-4">How to Learn Effectively</h2>
          <div className="space-y-4 text-slate-300">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Start with Small Trades</h4>
                <p className="text-sm">Begin with small amounts to understand how the market works before making larger investments.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Use AI Explanations</h4>
                <p className="text-sm">Whenever you see an unfamiliar term, click on it or use the AI Explain feature to learn instantly.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Track Your Decisions</h4>
                <p className="text-sm">Keep notes on why you bought or sold stocks. Learn from both profits and losses.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Learn from Others</h4>
                <p className="text-sm">Check the leaderboard to see successful strategies and learn from top performers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}