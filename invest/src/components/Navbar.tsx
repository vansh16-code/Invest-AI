'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, User, Trophy, BookOpen, Home, LogOut, Brain, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'AI Explain', href: '/ai-explain', icon: Brain },
  { name: 'AI Insights', href: '/ai-insights', icon: Lightbulb },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-700/50 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={isAuthenticated ? "/dashboard" : "/landing"} className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">InvestLearn</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            {isAuthenticated && navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-md border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/25"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}