from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# User schemas
class UserBase(BaseModel):
    username: str  # This will map to 'name' in the database
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Add balance as a computed property
    balance: float = 100000.0  # Default balance
    
    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Stock schemas
class StockBase(BaseModel):
    symbol: str
    name: str
    current_price: float
    change: float
    change_percent: float
    volume: int
    market_cap: Optional[float] = None
    sector: Optional[str] = None

class Stock(StockBase):
    id: int
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Portfolio schemas
class PortfolioBase(BaseModel):
    symbol: str
    quantity: int
    avg_price: float
    current_price: float

class Portfolio(PortfolioBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Transaction schemas
class TransactionBase(BaseModel):
    symbol: str
    type: str
    quantity: int
    price: float

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    user_id: int
    total: float
    created_at: datetime
    
    class Config:
        from_attributes = True

# Market data schemas
class MarketDataBase(BaseModel):
    symbol: str
    date: datetime
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: int

class MarketData(MarketDataBase):
    id: int
    
    class Config:
        from_attributes = True

# Leaderboard schemas
class LeaderboardEntry(BaseModel):
    username: str
    portfolio_value: float
    total_pnl: float
    total_pnl_percentage: float
    rank: int

# AI schemas
class AIExplainRequest(BaseModel):
    term: str

class AIExplanation(BaseModel):
    term: str
    explanation: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class MarketInsight(BaseModel):
    title: str
    content: str
    sentiment: str
    confidence: float

class PortfolioAnalysis(BaseModel):
    total_value: float
    total_pnl: float
    risk_score: float
    diversification_score: float
    recommendations: List[str]

# Market status schemas
class MarketStatus(BaseModel):
    is_open: bool
    next_open: Optional[datetime] = None
    next_close: Optional[datetime] = None

class MarketOverview(BaseModel):
    total_stocks: int
    market_cap: float
    volume: int
    top_gainers: List[Stock]
    top_losers: List[Stock]

class UserRank(BaseModel):
    rank: int
    total_users: int
    percentile: float