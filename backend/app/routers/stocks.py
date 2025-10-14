from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from .. import schemas, models
from ..database import get_db
from ..services.stock_service import stock_service

router = APIRouter(prefix="/api/stocks", tags=["stocks"])

@router.get("/", response_model=List[schemas.Stock])
async def get_stocks(db: AsyncSession = Depends(get_db)):
    await stock_service.update_stock_prices(db)
    
    result = await db.execute(select(models.Stock))
    stocks = result.scalars().all()
    return stocks

@router.get("/{symbol}", response_model=schemas.Stock)
async def get_stock(symbol: str, db: AsyncSession = Depends(get_db)):
    await stock_service.update_stock_prices(db, [symbol.upper()])
    
    result = await db.execute(select(models.Stock).filter(models.Stock.symbol == symbol.upper()))
    stock = result.scalar_one_or_none()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    return stock

@router.get("/{symbol}/history")
async def get_stock_history(symbol: str, period: str = "1d"):
    history = stock_service.get_stock_history(symbol.upper(), period)
    if not history:
        raise HTTPException(status_code=404, detail="Stock history not found")
    
    return {"symbol": symbol.upper(), "period": period, "data": history}

@router.get("/search")
async def search_stocks(q: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Stock).filter(
        models.Stock.symbol.ilike(f"%{q}%") | 
        models.Stock.name.ilike(f"%{q}%")
    ).limit(10))
    db_stocks = result.scalars().all()
    
    if db_stocks:
        return db_stocks
    
    external_results = stock_service.search_stocks(q)
    return external_results

@router.post("/update-prices")
async def force_update_stock_prices(db: AsyncSession = Depends(get_db)):
    success = await stock_service.update_stock_prices(db)
    if success:
        return {"message": "Stock prices updated successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to update stock prices")