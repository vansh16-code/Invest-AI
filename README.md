# InvestLearn - Stock Market Learning Platform

A comprehensive web application that teaches beginners how to invest in the stock market safely using virtual money and real market data.

## 🎯 Features

### Core Features
- **Virtual Trading**: Practice with ₹100,000 virtual money without any real financial risk
- **Real Market Data**: Trade with live stock prices from major exchanges
- **Portfolio Management**: Track your holdings, P&L, and overall performance
- **AI-Powered Learning**: Get instant explanations of financial terms and concepts
- **Leaderboard**: Compete with other learners and track your ranking
- **Educational Content**: Learn investment fundamentals through interactive content

### Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Responsive Design** for all devices
- **Mock API** with realistic trading simulation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd invest
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

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Trading dashboard
│   ├── learn/            # Educational content
│   ├── leaderboard/      # Competition rankings
│   └── page.tsx          # Landing page
├── components/            # Reusable UI components
│   ├── Navbar.tsx        # Navigation bar
│   ├── StockCard.tsx     # Stock display card
│   ├── TradeModal.tsx    # Trading interface
│   ├── PortfolioTable.tsx # Holdings display
│   ├── PortfolioCard.tsx  # Portfolio summary
│   ├── AIExplainBox.tsx   # AI explanations
│   └── LeaderboardCard.tsx # Rankings display
├── lib/                   # Utilities and API
│   ├── api.ts            # Mock API functions
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript type definitions
    └── index.ts
```

## 🎮 How to Use

### 1. Landing Page
- Overview of features and benefits
- Call-to-action to start trading

### 2. Dashboard
- View your portfolio summary (balance, holdings, P&L)
- Browse and search available stocks
- Execute buy/sell trades with the trading modal
- Monitor your holdings and performance

### 3. Learn Section
- Investment tips for beginners
- Key financial concepts with AI explanations
- Getting started guide

### 4. Leaderboard
- View top performers
- See your ranking among other users
- Understand how rankings work

## 🔧 Key Components

### Trading System
- **Virtual Balance**: Start with ₹100,000
- **Real-time Prices**: Mock data simulating live market prices
- **Portfolio Tracking**: Automatic P&L calculations
- **Trade Execution**: Buy/sell stocks with quantity selection

### Educational Features
- **AI Explanations**: Click on financial terms for instant explanations
- **Interactive Learning**: Hover tooltips and expandable content
- **Beginner-Friendly**: Simple language and clear concepts

### Gamification
- **Leaderboard**: Compete based on portfolio value
- **Rankings**: Real-time position tracking
- **Achievement System**: Ready for future implementation

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API**: Mock API with realistic data simulation

## 📊 Mock Data

The application uses realistic mock data including:
- Indian stocks (RELIANCE.NS, TCS.NS, INFY.NS, HDFCBANK.NS)
- US stocks (AAPL, TSLA)
- Historical price data simulation
- User portfolio and transaction data
- Leaderboard rankings

## 🔮 Future Enhancements

### Backend Integration
- FastAPI or Django backend
- PostgreSQL database
- Real market data APIs (Yahoo Finance, Alpha Vantage)
- User authentication (Clerk/JWT)

### Advanced Features
- AI mentor chat
- Investment challenges
- Quiz modules
- Social features
- Mobile app

### Analytics
- Advanced portfolio analytics
- Risk assessment
- Performance benchmarking
- Market insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎓 Educational Purpose

This application is designed for educational purposes only. All trading is done with virtual money, and no real financial transactions occur. Always consult with financial advisors before making real investment decisions.
