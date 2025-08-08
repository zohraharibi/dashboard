from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from database import get_db
from models import Stock, User
from schemas import StockCreate, StockResponse, StockUpdate, MessageResponse
from auth import get_current_user

router = APIRouter(prefix="/stocks", tags=["stocks"])

@router.get("/", response_model=List[StockResponse])
async def get_stocks(
    skip: int = Query(0, ge=0, description="Number of stocks to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of stocks to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all stocks with pagination"""
    stocks = db.query(Stock).offset(skip).limit(limit).all()
    return stocks

@router.get("/search", response_model=List[StockResponse])
async def search_stocks(
    q: str = Query(..., min_length=1, description="Search query for stock symbol or name"),
    limit: int = Query(20, ge=1, le=100, description="Number of results to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search stocks by symbol or name"""
    search_term = f"%{q.upper()}%"
    stocks = db.query(Stock).filter(
        or_(
            Stock.symbol.ilike(search_term),
            Stock.name.ilike(search_term)
        )
    ).limit(limit).all()
    return stocks

@router.get("/symbol/{symbol}", response_model=StockResponse)
async def get_stock_by_symbol(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a stock by its symbol"""
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stock with symbol '{symbol}' not found"
        )
    return stock

@router.get("/{stock_id}", response_model=StockResponse)
async def get_stock(
    stock_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a stock by ID"""
    stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stock with ID {stock_id} not found"
        )
    return stock

@router.post("/", response_model=StockResponse, status_code=status.HTTP_201_CREATED)
async def create_stock(
    stock_data: StockCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new stock"""
    # Check if stock with this symbol already exists
    existing_stock = db.query(Stock).filter(Stock.symbol == stock_data.symbol.upper()).first()
    if existing_stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stock with symbol '{stock_data.symbol}' already exists"
        )
    
    # Create new stock
    stock = Stock(
        symbol=stock_data.symbol.upper(),
        name=stock_data.name,
        description=stock_data.description,
        sector=stock_data.sector,
        exchange=stock_data.exchange,
        currency=stock_data.currency
    )
    
    db.add(stock)
    db.commit()
    db.refresh(stock)
    return stock

@router.put("/{stock_id}", response_model=StockResponse)
async def update_stock(
    stock_id: int,
    stock_data: StockUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a stock"""
    stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stock with ID {stock_id} not found"
        )
    
    # Update fields if provided
    update_data = stock_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(stock, field, value)
    
    db.commit()
    db.refresh(stock)
    return stock

@router.delete("/{stock_id}", response_model=MessageResponse)
async def delete_stock(
    stock_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a stock"""
    stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stock with ID {stock_id} not found"
        )
    
    # Check if stock is used in positions or watchlist
    # Due to cascade delete, this will also remove related positions and watchlist items
    db.delete(stock)
    db.commit()
    
    return MessageResponse(
        message=f"Stock '{stock.symbol}' deleted successfully",
        success=True
    )
