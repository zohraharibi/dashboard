from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Position, Stock, User
from schemas import PositionCreate, PositionResponse, PositionUpdate, MessageResponse, PortfolioSummary
from auth import get_current_user

router = APIRouter(prefix="/positions", tags=["positions"])

@router.get("/", response_model=List[PositionResponse])
async def get_user_positions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all positions for the current user"""
    positions = db.query(Position).filter(Position.user_id == current_user.id).all()
    return positions

@router.get("/user/{user_id}", response_model=List[PositionResponse])
async def get_positions_by_user_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all positions for a specific user (admin functionality or for viewing other users)"""
    # For now, allow any authenticated user to view any user's positions
    # In production, you might want to add admin checks here
    positions = db.query(Position).filter(Position.user_id == user_id).all()
    return positions

@router.get("/portfolio", response_model=PortfolioSummary)
async def get_portfolio_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get portfolio summary for the current user"""
    positions = db.query(Position).filter(Position.user_id == current_user.id).all()
    
    total_value = sum(position.total_value for position in positions)
    total_positions = len(positions)
    total_stocks = len(set(position.stock_id for position in positions))
    
    return PortfolioSummary(
        total_value=total_value,
        total_positions=total_positions,
        total_stocks=total_stocks,
        positions=positions
    )

@router.get("/{position_id}", response_model=PositionResponse)
async def get_position(
    position_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific position"""
    position = db.query(Position).filter(
        Position.id == position_id,
        Position.user_id == current_user.id
    ).first()
    
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found"
        )
    
    return position

@router.post("/", response_model=PositionResponse)
async def create_position(
    position_data: PositionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new position"""
    # Verify stock exists
    stock = db.query(Stock).filter(Stock.id == position_data.stock_id).first()
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found"
        )
    
    # Check if user already has a position in this stock
    existing_position = db.query(Position).filter(
        Position.user_id == current_user.id,
        Position.stock_id == position_data.stock_id
    ).first()
    
    if existing_position:
        # Update existing position (average cost)
        total_shares = existing_position.quantity + position_data.quantity
        total_cost = (existing_position.quantity * existing_position.purchase_price) + \
                    (position_data.quantity * position_data.purchase_price)
        new_avg_price = total_cost / total_shares
        
        existing_position.quantity = total_shares
        existing_position.purchase_price = new_avg_price
        
        db.commit()
        db.refresh(existing_position)
        return existing_position
    else:
        # Create new position
        position = Position(
            user_id=current_user.id,
            **position_data.dict()
        )
        db.add(position)
        db.commit()
        db.refresh(position)
        return position

@router.put("/{position_id}", response_model=PositionResponse)
async def update_position(
    position_id: int,
    position_data: PositionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a position"""
    position = db.query(Position).filter(
        Position.id == position_id,
        Position.user_id == current_user.id
    ).first()
    
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found"
        )
    
    # Update position fields
    update_data = position_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(position, field, value)
    
    db.commit()
    db.refresh(position)
    
    return position

@router.delete("/{position_id}", response_model=MessageResponse)
async def delete_position(
    position_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a position (sell all shares)"""
    position = db.query(Position).filter(
        Position.id == position_id,
        Position.user_id == current_user.id
    ).first()
    
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found"
        )
    
    stock_symbol = position.stock.symbol
    db.delete(position)
    db.commit()
    
    return MessageResponse(
        message=f"Position in {stock_symbol} deleted successfully"
    )

@router.post("/{position_id}/sell", response_model=PositionResponse)
async def sell_shares(
    position_id: int,
    quantity: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Sell a specific quantity of shares from a position"""
    position = db.query(Position).filter(
        Position.id == position_id,
        Position.user_id == current_user.id
    ).first()
    
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found"
        )
    
    if quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be greater than 0"
        )
    
    if quantity > position.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot sell more shares than owned"
        )
    
    # Update position quantity
    position.quantity -= quantity
    
    # If all shares sold, delete the position
    if position.quantity == 0:
        db.delete(position)
        db.commit()
        return MessageResponse(
            message=f"All shares sold. Position closed."
        )
    else:
        db.commit()
        db.refresh(position)
        return position
