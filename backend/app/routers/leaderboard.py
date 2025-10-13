from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

@router.get("/", response_model=List[schemas.LeaderboardEntry])
def get_leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    # Calculate portfolio values and P&L for all users
    leaderboard_data = db.query(
        models.User.username,
        func.coalesce(func.sum(models.Portfolio.current_price * models.Portfolio.quantity), 0).label('portfolio_value'),
        func.coalesce(func.sum((models.Portfolio.current_price - models.Portfolio.avg_price) * models.Portfolio.quantity), 0).label('total_pnl')
    ).outerjoin(models.Portfolio).group_by(models.User.id, models.User.username).all()
    
    # Calculate P&L percentage and sort by portfolio value
    leaderboard = []
    for i, (username, portfolio_value, total_pnl) in enumerate(leaderboard_data):
        invested_amount = portfolio_value - total_pnl if portfolio_value > 0 else 0
        pnl_percentage = (total_pnl / invested_amount * 100) if invested_amount > 0 else 0
        
        leaderboard.append({
            "username": username,
            "portfolio_value": float(portfolio_value),
            "total_pnl": float(total_pnl),
            "total_pnl_percentage": float(pnl_percentage),
            "rank": i + 1
        })
    
    # Sort by portfolio value (descending)
    leaderboard.sort(key=lambda x: x["portfolio_value"], reverse=True)
    
    # Update ranks after sorting
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1
    
    return leaderboard[:limit]