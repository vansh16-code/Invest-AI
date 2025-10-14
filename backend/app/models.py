from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)  # Renamed from 'name' to 'username' for consistency
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    balance = Column(Float, default=100000.0)  # Default $100,000 starting balance
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True))
    
    portfolio = relationship("Portfolio", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")

class Stock(Base):
    __tablename__ = "stocks"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True)
    name = Column(String)
    current_price = Column(Float)
    change = Column(Float)
    change_percent = Column(Float)
    volume = Column(Integer)
    market_cap = Column(Float)
    sector = Column(String)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

class Portfolio(Base):
    __tablename__ = "portfolio"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    symbol = Column(String)
    quantity = Column(Integer)
    avg_price = Column(Float)
    current_price = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="portfolio")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    symbol = Column(String)
    type = Column(String)  # 'buy' or 'sell'
    quantity = Column(Integer)
    price = Column(Float)
    total = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="transactions")

class MarketData(Base):
    __tablename__ = "market_data"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String)
    date = Column(DateTime(timezone=True))
    open_price = Column(Float)
    high_price = Column(Float)
    low_price = Column(Float)
    close_price = Column(Float)
    volume = Column(Integer)
    
class AIExplanation(Base):
    __tablename__ = "ai_explanations"
    
    id = Column(Integer, primary_key=True, index=True)
    term = Column(String, unique=True, index=True)
    explanation = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())