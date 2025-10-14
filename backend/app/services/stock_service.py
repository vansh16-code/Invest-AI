import yfinance as yf
import pandas as pd
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .. import models, schemas
from datetime import datetime, timedelta

class StockService:
    def __init__(self):
        self.default_stocks = [
            "AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA", "NFLX", 
            "AMD", "INTC", "CRM", "ORCL", "ADBE", "PYPL", "UBER", "SPOT",
            "COIN", "SQ", "ROKU", "ZM"
        ]
    
    async def update_stock_prices(self, db: AsyncSession, symbols: Optional[List[str]] = None):
        if not symbols:
            symbols = self.default_stocks
        
        try:
            tickers = yf.Tickers(' '.join(symbols))
            
            for symbol in symbols:
                try:
                    ticker = tickers.tickers[symbol]
                    info = ticker.info
                    hist = ticker.history(period="2d")
                    
                    if len(hist) < 2:
                        continue
                    
                    current_price = hist['Close'].iloc[-1]
                    prev_price = hist['Close'].iloc[-2]
                    change = current_price - prev_price
                    change_percent = (change / prev_price) * 100
                    
                    result = await db.execute(select(models.Stock).filter(models.Stock.symbol == symbol))
                    db_stock = result.scalar_one_or_none()
                    
                    if db_stock:
                        db_stock.current_price = float(current_price)
                        db_stock.change = float(change)
                        db_stock.change_percent = float(change_percent)
                        db_stock.volume = int(hist['Volume'].iloc[-1]) if not pd.isna(hist['Volume'].iloc[-1]) else 0
                        db_stock.market_cap = info.get('marketCap', 0)
                        db_stock.sector = info.get('sector', 'Unknown')
                        db_stock.updated_at = datetime.utcnow()
                    else:
                        db_stock = models.Stock(
                            symbol=symbol,
                            name=info.get('longName', symbol),
                            current_price=float(current_price),
                            change=float(change),
                            change_percent=float(change_percent),
                            volume=int(hist['Volume'].iloc[-1]) if not pd.isna(hist['Volume'].iloc[-1]) else 0,
                            market_cap=info.get('marketCap', 0),
                            sector=info.get('sector', 'Unknown')
                        )
                        db.add(db_stock)
                    
                except Exception as e:
                    print(f"Error updating {symbol}: {e}")
                    continue
            
            await db.commit()
            return True
        except Exception as e:
            print(f"Error updating stock prices: {e}")
            return False
    

    
    def search_stocks(self, query: str, limit: int = 10):
        try:
            ticker = yf.Ticker(query.upper())
            info = ticker.info
            
            if 'longName' in info:
                return [{
                    "symbol": query.upper(),
                    "name": info.get('longName', query.upper()),
                    "current_price": info.get('currentPrice', 0),
                    "change": 0,
                    "change_percent": 0,
                    "volume": info.get('volume', 0),
                    "market_cap": info.get('marketCap', 0),
                    "sector": info.get('sector', 'Unknown')
                }]
            return []
        except:
            return []

stock_service = StockService()