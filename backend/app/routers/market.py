from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, time
from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/market", tags=["market"])

@router.get("/status", response_model=schemas.MarketStatus)
def get_market_status():
    # Simple market hours check (NYSE: 9:30 AM - 4:00 PM ET)
    now = datetime.now().time()
    market_open = time(9, 30)
    market_close = time(16, 0)
    
    is_open = market_open <= now <= market_close
    
    return {
        "is_open": is_open,
        "next_open": None,  # Would calculate next market open time
        "next_close": None  # Would calculate next market close time
    }

@router.get("/overview", response_model=schemas.MarketOverview)
def get_market_overview(db: Session = Depends(get_db)):
    # Get basic market statistics
    total_stocks = db.query(models.Stock).count()
    total_market_cap = db.query(func.sum(models.Stock.market_cap)).scalar() or 0
    total_volume = db.query(func.sum(models.Stock.volume)).scalar() or 0
    
    # Get top gainers and losers
    top_gainers = db.query(models.Stock).order_by(desc(models.Stock.change_percent)).limit(5).all()
    top_losers = db.query(models.Stock).order_by(models.Stock.change_percent).limit(5).all()
    
    return {
        "total_stocks": total_stocks,
        "market_cap": total_market_cap,
        "volume": total_volume,
        "top_gainers": top_gainers,
        "top_losers": top_losers
    }

@router.get("/top-movers")
def get_top_movers(db: Session = Depends(get_db)):
    top_gainers = db.query(models.Stock).order_by(desc(models.Stock.change_percent)).limit(10).all()
    top_losers = db.query(models.Stock).order_by(models.Stock.change_percent).limit(10).all()
    most_active = db.query(models.Stock).order_by(desc(models.Stock.volume)).limit(10).all()
    
    return {
        "gainers": top_gainers,
        "losers": top_losers,
        "most_active": most_active
    }