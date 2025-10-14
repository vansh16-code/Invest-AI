from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from .. import schemas, models
from ..database import get_db
from ..auth import get_current_user
from ..services.ai_service import ai_service

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/explain", response_model=dict)
async def explain_term(
    request: schemas.AIExplainRequest,
    db: AsyncSession = Depends(get_db)
):
    explanation = await ai_service.explain_term(request.term, db)
    return {
        "term": request.term,
        "explanation": explanation
    }

@router.get("/insights", response_model=List[schemas.MarketInsight])
async def get_market_insights():
    insights = ai_service.get_market_insights()
    return insights

@router.get("/portfolio-analysis", response_model=schemas.PortfolioAnalysis)
async def analyze_portfolio(
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.Portfolio).filter(models.Portfolio.user_id == current_user.id))
    portfolio = result.scalars().all()
    
    portfolio_data = []
    for holding in portfolio:
        portfolio_data.append({
            "symbol": holding.symbol,
            "quantity": holding.quantity,
            "avg_price": holding.avg_price,
            "current_price": holding.current_price
        })
    
    analysis = ai_service.analyze_portfolio(portfolio_data)
    return analysis



