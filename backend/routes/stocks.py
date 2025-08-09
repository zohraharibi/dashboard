from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from datetime import datetime, timedelta
from database import get_db
from models import Stock, User
from schemas import StockCreate, StockResponse, StockUpdate, MessageResponse, StockQuoteResponse
from auth import get_current_user
import os
import finnhub
import random

router = APIRouter(prefix="/stocks", tags=["stocks"])

# FinnHub configuration
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
if not FINNHUB_API_KEY:
    raise ValueError("FINNHUB_API_KEY not found in environment variables")

# Initialize Finnhub client
finnhub_client = finnhub.Client(api_key=FINNHUB_API_KEY)

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

@router.get("/chart/{symbol}/{timeframe}")
async def get_stock_chart_data(
    symbol: str,
    timeframe: str = Path(..., regex="^(1D|1W|1Y|5Y)$"),
    db: Session = Depends(get_db),
):
    """Returns stock chart data as an array of Y values (prices)"""
    # Verify stock exists
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    # Configure timeframe
    timeframe_config = {
        "1D": {"points": 24},  # 24 points (hourly for 1 day)
        "1W": {"points": 7},  # 28 points (daily for 4 weeks)
        "1Y": {"points": 12},  # 12 points (monthly for 1 year)
        "5Y": {"points": 60}    # 5 points (yearly for 5 years)
    }
    
    config = timeframe_config.get(timeframe)
    
    # Generate symbol-specific chart data
    import hashlib
    import random
    
    # Create a seed based on symbol to ensure consistent but different data per symbol
    seed = int(hashlib.md5(symbol.encode()).hexdigest()[:8], 16)
    random.seed(seed)
    
    # Generate symbol-specific price range
    base_price = 50 + (seed % 200)  # Price between 50-250
    volatility = 0.1 + (seed % 30) / 100  # Volatility between 0.1-0.4
    
    y_values = []
    current_price = base_price
    
    for _ in range(config["points"]):
        # Add some realistic price movement
        change_percent = (random.random() - 0.5) * volatility
        current_price = current_price * (1 + change_percent)
        
        # Keep price within reasonable bounds
        current_price = max(10, min(500, current_price))
        
        y_values.append(round(current_price, 2))  # Store just the price (Y value)
    
    return {
        "symbol": symbol.upper(),
        "timeframe": timeframe,
        "y_values": y_values,  # Array of prices (Y values)
    }

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


# Add these new endpoints to your existing router

@router.get("/{symbol}/quote", response_model=StockQuoteResponse)
async def get_stock_quote(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get real-time stock quote data from FinnHub for a specific stock symbol.
    Returns price, change, and market data with direction indicator.
    """
    # First check if stock exists in our database
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stock with symbol '{symbol}' not found in our database"
        )
    
    try:
        data = finnhub_client.quote(symbol.upper())
        
        if not data or 'c' not in data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No quote data available for symbol '{symbol}'"
            )
        
        # Determine direction
        change = data.get('d', 0)
        if change > 0:
            direction = "up"
        elif change < 0:
            direction = "down"
        else:
            direction = "neutral"
        
        return StockQuoteResponse(
            current_price=data['c'],
            change=data['d'],
            percent_change=data['dp'],
            high_price=data['h'],
            low_price=data['l'],
            open_price=data['o'],
            previous_close=data['pc'],
            direction=direction,
            last_updated=datetime.utcnow()
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching stock quote: {str(e)}"
        )

@router.get("/{symbol}/profile")
async def get_stock_profile(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get company profile information from FinnHub for a specific stock symbol.
    """
    # Verify stock exists in our database first
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stock with symbol '{symbol}' not found in our database"
        )
    
    try:
        profile_data = finnhub_client.company_profile2(symbol=symbol.upper())
        
        if not profile_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No profile data available for symbol '{symbol}'"
            )
        
        return profile_data
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching company profile: {str(e)}"
        )

