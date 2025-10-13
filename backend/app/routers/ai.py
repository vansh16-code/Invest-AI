from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models
from ..database import get_db
from ..auth import get_current_user
from ..services.ai_service import ai_service

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/explain", response_model=dict)
def explain_term(
    request: schemas.AIExplainRequest,
    db: Session = Depends(get_db)
):
    explanation = ai_service.explain_term(request.term, db)
    return {
        "term": request.term,
        "explanation": explanation
    }

@router.get("/insights", response_model=List[schemas.MarketInsight])
def get_market_insights():
    insights = ai_service.get_market_insights()
    return insights

@router.get("/portfolio-analysis", response_model=schemas.PortfolioAnalysis)
def analyze_portfolio(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get user's portfolio
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).all()
    
    # Convert to format expected by AI service
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