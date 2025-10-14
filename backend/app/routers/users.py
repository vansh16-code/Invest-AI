from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from typing import List
from .. import schemas, models
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=schemas.User)
async def get_current_user_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.User)
async def update_user_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user_update.username:
        result = await db.execute(select(models.User).filter(
            models.User.username == user_update.username,
            models.User.id != current_user.id
        ))
        existing_user = result.scalar_one_or_none()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = user_update.username
    
    if user_update.email:
        result = await db.execute(select(models.User).filter(
            models.User.email == user_update.email,
            models.User.id != current_user.id
        ))
        existing_user = result.scalar_one_or_none()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = user_update.email
    
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.get("/me/portfolio", response_model=List[schemas.Portfolio])
async def get_user_portfolio(
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.Portfolio).filter(models.Portfolio.user_id == current_user.id))
    portfolio = result.scalars().all()
    
    portfolio_symbols = list(set([holding.symbol for holding in portfolio]))
    
    if portfolio_symbols:
        from ..services.stock_service import stock_service
        await stock_service.update_stock_prices(db, portfolio_symbols)
    
    for holding in portfolio:
        stock_result = await db.execute(select(models.Stock).filter(models.Stock.symbol == holding.symbol))
        stock = stock_result.scalar_one_or_none()
        if stock:
            holding.current_price = stock.current_price
    
    await db.commit()
    return portfolio

@router.get("/me/transactions", response_model=List[schemas.Transaction])
async def get_user_transactions(
    limit: int = 50,
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.Transaction).filter(
        models.Transaction.user_id == current_user.id
    ).order_by(models.Transaction.created_at.desc()).limit(limit))
    transactions = result.scalars().all()
    
    return transactions

@router.get("/me/rank", response_model=schemas.UserRank)
async def get_user_rank(
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Calculate portfolio values for all users
    user_portfolios_query = select(
        models.User.id,
        func.sum(models.Portfolio.current_price * models.Portfolio.quantity).label('portfolio_value')
    ).select_from(models.User.join(models.Portfolio)).group_by(models.User.id)
    
    user_portfolios_result = await db.execute(user_portfolios_query)
    user_portfolios = user_portfolios_result.all()
    
    # Sort by portfolio value to get rankings
    sorted_portfolios = sorted(user_portfolios, key=lambda x: x.portfolio_value or 0, reverse=True)
    
    total_users = len(sorted_portfolios)
    user_rank = None
    
    for i, portfolio in enumerate(sorted_portfolios):
        if portfolio.id == current_user.id:
            user_rank = i + 1
            break
    
    if not user_rank:
        return {"rank": total_users, "total_users": total_users, "percentile": 0}
    
    percentile = ((total_users - user_rank + 1) / total_users) * 100
    
    return {
        "rank": user_rank,
        "total_users": total_users,
        "percentile": percentile
    }

@router.get("/me/portfolio-debug")
async def debug_portfolio(
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.Portfolio).filter(models.Portfolio.user_id == current_user.id))
    portfolio = result.scalars().all()
    
    debug_info = []
    total_value = 0
    total_pnl = 0
    
    for holding in portfolio:
        # Get current stock price
        stock_result = await db.execute(select(models.Stock).filter(models.Stock.symbol == holding.symbol))
        stock = stock_result.scalar_one_or_none()
        
        current_price = stock.current_price if stock else holding.current_price
        market_value = current_price * holding.quantity
        cost_basis = holding.avg_price * holding.quantity
        pnl = market_value - cost_basis
        pnl_percent = (pnl / cost_basis * 100) if cost_basis > 0 else 0
        
        total_value += market_value
        total_pnl += pnl
        
        debug_info.append({
            "symbol": holding.symbol,
            "quantity": holding.quantity,
            "avg_price": holding.avg_price,
            "current_price": current_price,
            "cost_basis": cost_basis,
            "market_value": market_value,
            "pnl": pnl,
            "pnl_percent": pnl_percent,
            "stock_updated_at": stock.updated_at.isoformat() if stock and stock.updated_at else None
        })
    
    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "balance": current_user.balance,
        "total_portfolio_value": total_value,
        "total_pnl": total_pnl,
        "total_pnl_percent": (total_pnl / (total_value - total_pnl) * 100) if (total_value - total_pnl) > 0 else 0,
        "holdings": debug_info
    }