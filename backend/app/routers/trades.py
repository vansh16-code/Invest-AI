from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .. import schemas, models
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/api/trades", tags=["trades"])

@router.post("/", response_model=schemas.Transaction)
async def execute_trade(
    trade: schemas.TransactionCreate,
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Get stock information
    result = await db.execute(select(models.Stock).filter(models.Stock.symbol == trade.symbol.upper()))
    stock = result.scalar_one_or_none()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    # Use current market price
    current_price = stock.current_price
    total_cost = current_price * trade.quantity
    
    if trade.type == "buy":
        # Check if user has enough balance
        if current_user.balance < total_cost:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        
        # Update user balance
        current_user.balance -= total_cost
        
        # Update or create portfolio holding
        portfolio_result = await db.execute(select(models.Portfolio).filter(
            models.Portfolio.user_id == current_user.id,
            models.Portfolio.symbol == trade.symbol.upper()
        ))
        portfolio_holding = portfolio_result.scalar_one_or_none()
        
        if portfolio_holding:
            # Update existing holding
            total_shares = portfolio_holding.quantity + trade.quantity
            total_cost_basis = (portfolio_holding.avg_price * portfolio_holding.quantity) + total_cost
            portfolio_holding.avg_price = total_cost_basis / total_shares
            portfolio_holding.quantity = total_shares
            portfolio_holding.current_price = current_price
        else:
            # Create new holding
            portfolio_holding = models.Portfolio(
                user_id=current_user.id,
                symbol=trade.symbol.upper(),
                quantity=trade.quantity,
                avg_price=current_price,
                current_price=current_price
            )
            db.add(portfolio_holding)
    
    elif trade.type == "sell":
        # Check if user has enough shares
        portfolio_result = await db.execute(select(models.Portfolio).filter(
            models.Portfolio.user_id == current_user.id,
            models.Portfolio.symbol == trade.symbol.upper()
        ))
        portfolio_holding = portfolio_result.scalar_one_or_none()
        
        if not portfolio_holding or portfolio_holding.quantity < trade.quantity:
            raise HTTPException(status_code=400, detail="Insufficient shares")
        
        # Update user balance
        current_user.balance += total_cost
        
        # Update portfolio holding
        portfolio_holding.quantity -= trade.quantity
        portfolio_holding.current_price = current_price
        
        # Remove holding if quantity becomes 0
        if portfolio_holding.quantity == 0:
            db.delete(portfolio_holding)
    
    else:
        raise HTTPException(status_code=400, detail="Invalid trade type")
    
    # Create transaction record
    transaction = models.Transaction(
        user_id=current_user.id,
        symbol=trade.symbol.upper(),
        type=trade.type,
        quantity=trade.quantity,
        price=current_price,
        total=total_cost
    )
    db.add(transaction)
    
    await db.commit()
    await db.refresh(transaction)
    
    return transaction