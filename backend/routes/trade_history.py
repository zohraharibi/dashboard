from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from database import get_db
from models import TradeHistory, User
from schemas import TradeHistoryResponse
from auth import get_current_user

router = APIRouter(prefix="/trade-history", tags=["trade-history"])

@router.get("/", response_model=List[TradeHistoryResponse])
async def get_user_trade_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get complete trade history for the current user"""
    trades = db.query(TradeHistory).filter(
        TradeHistory.user_id == current_user.id
    ).order_by(desc(TradeHistory.trade_date)).all()
    
    return trades
