from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models
from ..database import get_db
from ..services.stock_service import stock_service

router = APIRouter(prefix="/api/stocks", tags=["stocks"])

@router.get("/", response_model=List[schemas.Stock])
def get_stocks(db: Session = Depends(get_db)):
    # Update stock prices before returning
    stock_service.update_stock_prices(db)
    
    stocks = db.query(models.Stock).all()
    return stocks

@router.get("/{symbol}", response_model=schemas.Stock)
def get_stock(symbol: str, db: Session = Depends(get_db)):
    # Update this specific stock's price
    stock_service.update_stock_prices(db, [symbol.upper()])
    
    stock = db.query(models.Stock).filter(models.Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    return stock

@router.get("/{symbol}/history")
def get_stock_history(symbol: str, period: str = "1d"):
    history = stock_service.get_stock_history(symbol.upper(), period)
    if not history:
        raise HTTPException(status_code=404, detail="Stock history not found")
    
    return {"symbol": symbol.upper(), "period": period, "data": history}

@router.get("/search")
def search_stocks(q: str, db: Session = Depends(get_db)):
    # First search in database
    db_stocks = db.query(models.Stock).filter(
        models.Stock.symbol.ilike(f"%{q}%") | 
        models.Stock.name.ilike(f"%{q}%")
    ).limit(10).all()
    
    if db_stocks:
        return db_stocks
    
    # If not found in database, search using external API
    external_results = stock_service.search_stocks(q)
    return external_results