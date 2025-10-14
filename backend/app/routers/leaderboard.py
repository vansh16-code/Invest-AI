from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from typing import List
from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

@router.get("", response_model=List[schemas.LeaderboardEntry])
async def get_leaderboard(limit: int = 10, db: AsyncSession = Depends(get_db)):
    # Calculate portfolio values and P&L for all users
    leaderboard_query = select(
        models.User.id,
        models.User.name,
        func.coalesce(func.sum(models.Portfolio.current_price * models.Portfolio.quantity), 0).label('portfolio_value'),
        func.coalesce(func.sum((models.Portfolio.current_price - models.Portfolio.avg_price) * models.Portfolio.quantity), 0).label('total_pnl')
    ).select_from(models.User).outerjoin(models.Portfolio).group_by(models.User.id, models.User.name)
    
    result = await db.execute(leaderboard_query)
    leaderboard_data = result.all()
    
    # Calculate P&L percentage and create leaderboard entries
    leaderboard = []
    for user_id, name, portfolio_value, total_pnl in leaderboard_data:
        invested_amount = portfolio_value - total_pnl if portfolio_value > 0 else 0
        pnl_percentage = (total_pnl / invested_amount * 100) if invested_amount > 0 else 0
        
        leaderboard.append({
            "id": user_id,
            "username": name,
            "portfolio_value": float(portfolio_value),
            "total_pnl": float(total_pnl),
            "total_pnl_percentage": float(pnl_percentage),
            "rank": 0  # Will be set after sorting
        })
    
    # Sort by portfolio value (descending)
    leaderboard.sort(key=lambda x: x["portfolio_value"], reverse=True)
    
    # Assign ranks after sorting
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1
    
    return leaderboard[:limit]