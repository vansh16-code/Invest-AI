import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Stock API endpoints
export const stockAPI = {
  getStocks: async () => {
    const response = await api.get('/api/stocks/')
    return response.data
  },
  
  getStock: async (symbol: string) => {
    const response = await api.get(`/api/stocks/${symbol}`)
    return response.data
  },
  
  getStockHistory: async (symbol: string, period: string = '1d') => {
    const response = await api.get(`/api/stocks/${symbol}/history`, {
      params: { period }
    })
    return response.data
  },

  searchStocks: async (query: string) => {
    const response = await api.get('/api/stocks/search', {
      params: { q: query }
    })
    return response.data
  }
}

// User API endpoints
export const userAPI = {
  getCurrentUser: async () => {
    const response = await api.get('/api/users/me')
    return response.data
  },
  
  getPortfolio: async () => {
    const response = await api.get('/api/users/me/portfolio')
    return response.data
  },
  
  getTransactions: async (limit: number = 50) => {
    const response = await api.get('/api/users/me/transactions', {
      params: { limit }
    })
    return response.data
  },
  
  trade: async (tradeData: { 
    symbol: string
    quantity: number
    type: 'buy' | 'sell'
    price: number 
  }) => {
    const response = await api.post('/api/trades/', tradeData)
    return response.data
  },

  updateProfile: async (profileData: {
    username?: string
    email?: string
  }) => {
    const response = await api.put('/api/users/me', profileData)
    return response.data
  }
}

// Authentication API endpoints
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', credentials)
    const { access_token, user } = response.data
    localStorage.setItem('auth_token', access_token)
    return { token: access_token, user }
  },

  register: async (userData: {
    username: string
    email: string
    password: string
  }) => {
    const response = await api.post('/api/auth/register', userData)
    const { access_token, user } = response.data
    localStorage.setItem('auth_token', access_token)
    return { token: access_token, user }
  },

  logout: async () => {
    localStorage.removeItem('auth_token')
    return { success: true }
  },

  refreshToken: async () => {
    const response = await api.post('/api/auth/refresh')
    const { access_token } = response.data
    localStorage.setItem('auth_token', access_token)
    return access_token
  }
}

// Leaderboard API endpoints
export const leaderboardAPI = {
  getLeaderboard: async (limit: number = 10) => {
    const response = await api.get('/api/leaderboard', {
      params: { limit }
    })
    return response.data
  },

  getUserRank: async () => {
    const response = await api.get('/api/users/me/rank')
    return response.data
  }
}


export const aiAPI = {
  explainTerm: async (term: string) => {
    const response = await api.post('/api/ai/explain', { term })
    return response.data
  },

  getMarketInsights: async () => {
    const response = await api.get('/api/ai/insights')
    return response.data
  },

  analyzePortfolio: async () => {
    const response = await api.get('/api/ai/portfolio-analysis')
    return response.data
  }
}


export const marketAPI = {
  getMarketStatus: async () => {
    const response = await api.get('/api/market/status')
    return response.data
  },

  getMarketOverview: async () => {
    const response = await api.get('/api/market/overview')
    return response.data
  },

  getTopMovers: async () => {
    const response = await api.get('/api/market/top-movers')
    return response.data
  }
}


export const handleApiError = (error: any) => {
  if (error.response) {
    
    const message = error.response.data?.detail || error.response.data?.message || 'An error occurred'
    return { error: message, status: error.response.status }
  } else if (error.request) {
    
    return { error: 'Network error. Please check your connection.', status: 0 }
  } else {
    
    return { error: 'An unexpected error occurred.', status: -1 }
  }
}

export default api