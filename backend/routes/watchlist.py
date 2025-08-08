from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Watchlist, Stock, User
from schemas import WatchlistCreate, WatchlistResponse, WatchlistUpdate, MessageResponse, WatchlistSummary
from auth import get_current_user

router = APIRouter(prefix="/watchlist", tags=["watchlist"])

@router.get("/", response_model=List[WatchlistResponse])
async def get_user_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all watchlist items for the current user"""
    watchlist = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    return watchlist

@router.get("/summary", response_model=WatchlistSummary)
async def get_watchlist_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get watchlist summary for the current user"""
    watchlist = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    
    return WatchlistSummary(
        total_watched=len(watchlist),
        watchlist=watchlist
    )

@router.get("/{watchlist_id}", response_model=WatchlistResponse)
async def get_watchlist_item(
    watchlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific watchlist item"""
    watchlist_item = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id,
        Watchlist.user_id == current_user.id
    ).first()
    
    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watchlist item not found"
        )
    
    return watchlist_item

@router.post("/", response_model=WatchlistResponse)
async def add_to_watchlist(
    watchlist_data: WatchlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a stock to watchlist"""
    # Verify stock exists
    stock = db.query(Stock).filter(Stock.id == watchlist_data.stock_id).first()
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found"
        )
    
    # Check if stock is already in watchlist
    existing_item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.stock_id == watchlist_data.stock_id
    ).first()
    
    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stock '{stock.symbol}' is already in your watchlist"
        )
    
    # Create new watchlist item
    watchlist_item = Watchlist(
        user_id=current_user.id,
        **watchlist_data.dict()
    )
    db.add(watchlist_item)
    db.commit()
    db.refresh(watchlist_item)
    
    return watchlist_item

@router.post("/symbol/{symbol}", response_model=WatchlistResponse)
async def add_to_watchlist_by_symbol(
    symbol: str,
    notes: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a stock to watchlist by symbol"""
    # Find stock by symbol
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stock with symbol '{symbol}' not found"
        )
    
    # Check if stock is already in watchlist
    existing_item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.stock_id == stock.id
    ).first()
    
    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stock '{symbol}' is already in your watchlist"
        )
    
    # Create new watchlist item
    watchlist_item = Watchlist(
        user_id=current_user.id,
        stock_id=stock.id,
        notes=notes
    )
    db.add(watchlist_item)
    db.commit()
    db.refresh(watchlist_item)
    
    return watchlist_item

@router.put("/{watchlist_id}", response_model=WatchlistResponse)
async def update_watchlist_item(
    watchlist_id: int,
    watchlist_data: WatchlistUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update watchlist item notes"""
    watchlist_item = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id,
        Watchlist.user_id == current_user.id
    ).first()
    
    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watchlist item not found"
        )
    
    # Update watchlist item
    update_data = watchlist_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(watchlist_item, field, value)
    
    db.commit()
    db.refresh(watchlist_item)
    
    return watchlist_item

@router.delete("/{watchlist_id}", response_model=MessageResponse)
async def remove_from_watchlist(
    watchlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a stock from watchlist"""
    watchlist_item = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id,
        Watchlist.user_id == current_user.id
    ).first()
    
    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watchlist item not found"
        )
    
    stock_symbol = watchlist_item.stock.symbol
    db.delete(watchlist_item)
    db.commit()
    
    return MessageResponse(
        message=f"Stock '{stock_symbol}' removed from watchlist"
    )

@router.delete("/symbol/{symbol}", response_model=MessageResponse)
async def remove_from_watchlist_by_symbol(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a stock from watchlist by symbol"""
    # Find stock by symbol
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stock with symbol '{symbol}' not found"
        )
    
    # Find watchlist item
    watchlist_item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.stock_id == stock.id
    ).first()
    
    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stock '{symbol}' not found in your watchlist"
        )
    
    db.delete(watchlist_item)
    db.commit()
    
    return MessageResponse(
        message=f"Stock '{symbol}' removed from watchlist"
    )
