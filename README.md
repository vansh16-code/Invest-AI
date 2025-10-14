# Invest-AI 📈

An intelligent investment learning platform that combines AI-powered explanations with gamified trading simulations to help users learn about investing and financial markets safely using virtual money.

## 🚀 Features

### 🎯 Core Features

- **Virtual Trading**: Practice with $100,000 virtual money without any real financial risk
- **Real-Time Stock Data**: Live stock prices from Yahoo Finance API with 20+ popular stocks
- **AI-Powered Explanations**: Get instant AI explanations for complex financial concepts using Google Gemini AI
- **Portfolio Management**: Track your holdings, P&L, and overall performance with interactive charts
- **Leaderboard System**: Compete with other users and track your trading performance
- **Market Insights**: AI-generated market analysis and portfolio recommendations
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing

### 📊 Dashboard Features

- Real-time portfolio overview with live stock prices
- Profit/Loss tracking with interactive charts
- Quick stats and performance metrics
- Stock trading with real market data from Yahoo Finance
- Portfolio diversification analysis
- Market status and overview with top movers
- Historical stock data and charts

### 🎓 Learning Platform

- Interactive learning modules
- AI-powered financial term explanations with caching
- Progress tracking
- Gamified learning experience
- Portfolio analysis and personalized recommendations

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Authentication**: JWT-based auth with HTTP-only cookies
- **Icons**: Lucide React
- **HTTP Client**: Axios for API communication

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Stock Data**: Yahoo Finance API (yfinance)
- **AI Service**: Google Gemini AI for explanations and insights
- **Security**: CORS middleware, password hashing, token validation

### External APIs & Services
- **Yahoo Finance**: Real-time stock prices, historical data, company information
- **Google Gemini AI**: Financial term explanations, market insights, portfolio analysis
- **PostgreSQL**: User data, portfolios, transactions, stock data storage

## 📁 Project Structure

```
invest-ai/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── ai-explain/       # AI explanation feature
│   │   │   ├── dashboard/        # Trading dashboard
│   │   │   ├── landing/          # Landing page
│   │   │   ├── leaderboard/      # User rankings
│   │   │   ├── learn/            # Learning modules
│   │   │   ├── login/            # Authentication
│   │   │   ├── profile/          # User profile
│   │   │   └── register/         # User registration
│   │   ├── components/           # Reusable UI components
│   │   ├── contexts/            # React contexts
│   │   ├── lib/                 # Utility functions and API
│   │   └── types/               # TypeScript type definitions
│   └── public/                  # Static assets
└── backend/                 # FastAPI Backend
    ├── app/
    │   ├── routers/             # API endpoints
    │   │   ├── auth.py          # Authentication routes
    │   │   ├── users.py         # User management
    │   │   ├── stocks.py        # Stock data endpoints
    │   │   ├── trades.py        # Trading functionality
    │   │   ├── market.py        # Market data
    │   │   ├── leaderboard.py   # User rankings
    │   │   └── ai.py            # AI-powered features
    │   ├── services/            # Business logic
    │   │   ├── stock_service.py # Yahoo Finance integration
    │   │   └── ai_service.py    # Gemini AI integration
    │   ├── models.py            # Database models
    │   ├── schemas.py           # Pydantic schemas
    │   ├── auth.py              # JWT authentication
    │   ├── database.py          # Database configuration
    │   └── main.py              # FastAPI application
    └── requirements.txt         # Python dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.8+
- PostgreSQL
- npm or yarn

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/vansh16-code/Invest-AI.git
cd Invest-AI/backend
```

2. Create virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up PostgreSQL database and environment variables:

```bash
# Create .env file in backend directory
DATABASE_URL=postgresql://username:password@localhost:5432/invest_ai_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=your-gemini-api-key-here
```

4. Run the backend server:

```bash
python -m uvicorn app.main:app --reload
```

Backend will be available at [http://localhost:8000](http://localhost:8000)
API documentation available at [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### User Management
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/me/portfolio` - Get user portfolio
- `GET /api/users/me/transactions` - Get user transaction history
- `GET /api/users/me/rank` - Get user ranking

### Stock Data
- `GET /api/stocks` - Get all stocks with real-time prices
- `GET /api/stocks/{symbol}` - Get specific stock data
- `GET /api/stocks/{symbol}/history` - Get historical stock data
- `GET /api/stocks/search` - Search stocks by symbol/name

### Trading
- `POST /api/trades` - Execute buy/sell orders

### Market Data
- `GET /api/market/status` - Market open/close status
- `GET /api/market/overview` - Market statistics and top movers
- `GET /api/market/top-movers` - Top gainers, losers, most active

### Leaderboard
- `GET /api/leaderboard` - Get user rankings by portfolio performance

### AI Features
- `POST /api/ai/explain` - Get AI explanations for financial terms
- `GET /api/ai/insights` - Get AI-generated market insights
- `GET /api/ai/portfolio-analysis` - Get AI portfolio analysis

## 🗄️ Database Schema

### Core Tables
- **Users**: User accounts with authentication and balance
- **Stocks**: Stock information with real-time prices
- **Portfolio**: User stock holdings with quantities and average prices
- **Transactions**: Trading history with buy/sell records
- **AIExplanations**: Cached AI explanations for financial terms
- **MarketData**: Historical stock price data

## 🎮 How to Use

1. **Register/Login**: Create an account or login to access the platform
2. **Explore Dashboard**: View your virtual portfolio and trading interface
3. **Learn**: Access educational modules to understand investment concepts
4. **Trade**: Practice buying and selling stocks with virtual money
5. **AI Explain**: Use AI to get explanations for complex financial terms
6. **Compete**: Check the leaderboard to see how you rank against other users

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Key Components

### Frontend Components
- **Dashboard**: Complete trading interface with real-time portfolio overview
- **AI Explain Box**: Interactive AI-powered explanation feature using Gemini AI
- **Trading Modal**: Stock buying/selling interface with real market prices
- **Portfolio Charts**: Visual representation of performance data with Recharts
- **Learning Modules**: Interactive educational content
- **Leaderboard**: User ranking and competition system

### Backend APIs
- **Authentication API**: JWT-based user registration and login
- **Stock API**: Real-time stock data from Yahoo Finance
- **Trading API**: Buy/sell order execution with portfolio management
- **User API**: Profile management and portfolio tracking
- **Market API**: Market status, overview, and top movers
- **Leaderboard API**: User rankings by portfolio performance
- **AI API**: Gemini AI-powered explanations and insights

## 📊 Real Data Features

The application uses real market data including:

- **20+ Popular Stocks**: AAPL, GOOGL, MSFT, AMZN, TSLA, META, NVDA, NFLX, AMD, INTC, and more
- **Real-Time Prices**: Live stock prices from Yahoo Finance API
- **Historical Data**: Actual historical price charts and data
- **Market Information**: Real market cap, volume, sector information
- **AI Insights**: Genuine AI-powered explanations using Google Gemini
- **User Data**: Persistent user portfolios, transactions, and rankings in PostgreSQL

## 🔮 Future Enhancements

- [ ] WebSocket integration for real-time price updates
- [ ] Advanced charting tools with technical indicators
- [ ] Social trading features and user following
- [ ] Mobile app development
- [ ] News integration and sentiment analysis
- [ ] Options and derivatives trading simulation
- [ ] Advanced AI portfolio optimization
- [ ] Paper trading competitions with prizes
- [ ] Educational video content integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vansh** - [@vansh16-code](https://github.com/vansh16-code)

## 🙏 Acknowledgments

- **Yahoo Finance API** for providing real-time stock market data
- **Google Gemini AI** for powering intelligent financial explanations
- **FastAPI** and **Next.js** communities for excellent frameworks
- **PostgreSQL** for reliable data storage
- Thanks to all the open-source libraries that made this project possible
- Inspired by the need for accessible financial education

## 🎓 Educational Purpose

This application is designed for educational purposes only. All trading is done with virtual money, and no real financial transactions occur. Always consult with financial advisors before making real investment decisions.

---

⭐ Star this repository if you found it helpful!
