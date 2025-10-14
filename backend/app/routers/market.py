from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, desc, select

from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/market", tags=["market"])



@router.get("/overview", response_model=schemas.MarketOverview)
async def get_market_overview(db: AsyncSession = Depends(get_db)):
    # Get basic market statistics
    total_stocks_result = await db.execute(select(func.count(models.Stock.id)))
    total_stocks = total_stocks_result.scalar()
    
    total_market_cap_result = await db.execute(select(func.sum(models.Stock.market_cap)))
    total_market_cap = total_market_cap_result.scalar() or 0
    
    total_volume_result = await db.execute(select(func.sum(models.Stock.volume)))
    total_volume = total_volume_result.scalar() or 0
    
    # Get top gainers and losers
    top_gainers_result = await db.execute(select(models.Stock).order_by(desc(models.Stock.change_percent)).limit(5))
    top_gainers = top_gainers_result.scalars().all()
    
    top_losers_result = await db.execute(select(models.Stock).order_by(models.Stock.change_percent).limit(5))
    top_losers = top_losers_result.scalars().all()
    
    return {
        "total_stocks": total_stocks,
        "market_cap": total_market_cap,
        "volume": total_volume,
        "top_gainers": top_gainers,
        "top_losers": top_losers
    }

@router.get("/top-movers")
async def get_top_movers(db: AsyncSession = Depends(get_db)):
    top_gainers_result = await db.execute(select(models.Stock).order_by(desc(models.Stock.change_percent)).limit(10))
    top_gainers = top_gainers_result.scalars().all()
    
    top_losers_result = await db.execute(select(models.Stock).order_by(models.Stock.change_percent).limit(10))
    top_losers = top_losers_result.scalars().all()
    
    most_active_result = await db.execute(select(models.Stock).order_by(desc(models.Stock.volume)).limit(10))
    most_active = most_active_result.scalars().all()
    
    return {
        "gainers": top_gainers,
        "losers": top_losers,
        "most_active": most_active
    }