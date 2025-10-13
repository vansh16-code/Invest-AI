'use client'

import { useState, useEffect } from 'react'
import { User, Settings, Save, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { userAPI, handleApiError } from '@/lib/api'

export default function Profile() {
  const { user, refreshUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await userAPI.updateProfile({
        username: formData.username,
        email: formData.email
      })
      
      await refreshUser()
      setSuccess('Profile updated successfully!')
    } catch (error) {
      console.error('Profile update failed:', error)
      const { error: errorMessage } = handleApiError(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
          <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
          <p className="text-slate-300 mb-6">Please log in to access your profile</p>
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Settings className="h-8 w-8 mr-3 text-purple-400" />
            Profile Settings
          </h1>
          <p className="text-slate-300 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700/50 rounded-md p-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-900/50 border border-green-700/50 rounded-md p-3">
                <p className="text-sm text-green-300">{success}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="bg-slate-700/30 p-4 rounded-md border border-slate-600/50">
              <h3 className="text-lg font-semibold text-white mb-2">Account Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Account Balance:</span>
                  <span className="text-white ml-2">₹{user?.balance?.toLocaleString() || '100,000'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Member Since:</span>
                  <span className="text-white ml-2">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Account Status:</span>
                  <span className="text-green-400 ml-2">
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">User ID:</span>
                  <span className="text-slate-300 ml-2">#{user?.id}</span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Learning Progress Section */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-8">
          <h3 className="text-lg font-semibold text-white mb-4">Learning Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Financial Terms Learned</span>
              <span className="text-purple-400 font-semibold">Coming Soon</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Trades Completed</span>
              <span className="text-purple-400 font-semibold">Coming Soon</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Learning Streak</span>
              <span className="text-purple-400 font-semibold">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}