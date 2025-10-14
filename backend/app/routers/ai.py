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



