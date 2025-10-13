from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .. import schemas, models
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=schemas.User)
def get_current_user_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.User)
def update_user_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.username:
        # Check if username is already taken
        existing_user = db.query(models.User).filter(
            models.User.name == user_update.username,
            models.User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.name = user_update.username
    
    if user_update.email:
        # Check if email is already taken
        existing_user = db.query(models.User).filter(
            models.User.email == user_update.email,
            models.User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = user_update.email
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/portfolio", response_model=List[schemas.Portfolio])
def get_user_portfolio(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).all()
    
    # Update current prices
    for holding in portfolio:
        stock = db.query(models.Stock).filter(models.Stock.symbol == holding.symbol).first()
        if stock:
            holding.current_price = stock.current_price
    
    db.commit()
    return portfolio

@router.get("/me/transactions", response_model=List[schemas.Transaction])
def get_user_transactions(
    limit: int = 50,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id
    ).order_by(models.Transaction.created_at.desc()).limit(limit).all()
    
    return transactions

@router.get("/me/rank", response_model=schemas.UserRank)
def get_user_rank(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate portfolio values for all users
    user_portfolios = db.query(
        models.User.id,
        func.sum(models.Portfolio.current_price * models.Portfolio.quantity).label('portfolio_value')
    ).join(models.Portfolio).group_by(models.User.id).subquery()
    
    # Get user rankings
    rankings = db.query(
        models.User.id,
        user_portfolios.c.portfolio_value,
        func.row_number().over(order_by=user_portfolios.c.portfolio_value.desc()).label('rank')
    ).join(user_portfolios, models.User.id == user_portfolios.c.id).all()
    
    total_users = len(rankings)
    user_rank = next((r for r in rankings if r.id == current_user.id), None)
    
    if not user_rank:
        return {"rank": total_users, "total_users": total_users, "percentile": 0}
    
    percentile = ((total_users - user_rank.rank + 1) / total_users) * 100
    
    return {
        "rank": user_rank.rank,
        "total_users": total_users,
        "percentile": percentile
    }