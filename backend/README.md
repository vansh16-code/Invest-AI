# Investment Trading API

A comprehensive FastAPI backend for investment trading and portfolio management.

## Features

- **Authentication**: JWT-based user authentication
- **User Management**: Profile management and portfolio tracking
- **Stock Data**: Real-time stock prices via Yahoo Finance
- **Trading**: Buy/sell stock transactions
- **Portfolio**: Track holdings and performance
- **Leaderboard**: User rankings by portfolio performance
- **AI Features**: Financial term explanations and market insights
- **Market Data**: Market status and overview

## Setup

### Prerequisites

- Python 3.8+
- PostgreSQL
- Docker (optional)

### Installation

1. **Clone and setup**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Database Setup**:
```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Or install PostgreSQL locally and create database
createdb invest_db
```

3. **Environment Variables**:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Run the application**:
```bash
python run.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile
- `GET /api/users/me/portfolio` - Get user portfolio
- `GET /api/users/me/transactions` - Get user transactions
- `GET /api/users/me/rank` - Get user rank

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/{symbol}` - Get specific stock
- `GET /api/stocks/{symbol}/history` - Get stock history
- `GET /api/stocks/search` - Search stocks

### Trading
- `POST /api/trades` - Execute trade

### Market
- `GET /api/market/status` - Market status
- `GET /api/market/overview` - Market overview
- `GET /api/market/top-movers` - Top movers

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard

### AI
- `POST /api/ai/explain` - Explain financial terms
- `GET /api/ai/insights` - Get market insights
- `GET /api/ai/portfolio-analysis` - Analyze portfolio

## Configuration

Key environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `OPENAI_API_KEY`: OpenAI API key for AI features

## Development

```bash
# Install development dependencies
pip install -r requirements.txt

# Run with auto-reload
python run.py

# Run tests (if implemented)
pytest
```