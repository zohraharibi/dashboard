from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
import re

# User schemas
class UserBase(BaseModel):
    email: str = Field(..., description="User email address")
    username: str = Field(..., min_length=3, max_length=50, description="Username")
    full_name: Optional[str] = Field(None, max_length=100, description="Full name")

    @validator('email')
    def validate_email(cls, v):
        # Basic email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()

    @validator('username')
    def validate_username(cls, v):
        # Username can only contain letters, numbers, and underscores
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return v.lower()

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v

class UserLogin(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")

    @validator('email')
    def validate_email(cls, v):
        return v.lower()

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

    @validator('email')
    def validate_email(cls, v):
        if v is not None:
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, v):
                raise ValueError('Invalid email format')
            return v.lower()
        return v

    @validator('username')
    def validate_username(cls, v):
        if v is not None:
            if not re.match(r'^[a-zA-Z0-9_]+$', v):
                raise ValueError('Username can only contain letters, numbers, and underscores')
            return v.lower()
        return v

# Stock schemas
class StockBase(BaseModel):
    symbol: str = Field(..., min_length=1, max_length=10, description="Stock symbol")
    name: str = Field(..., min_length=1, max_length=255, description="Company name")
    description: Optional[str] = Field(None, max_length=1000, description="Company description")
    sector: Optional[str] = Field(None, max_length=100, description="Business sector")
    exchange: Optional[str] = Field(None, max_length=50, description="Stock exchange")
    currency: str = Field(default="USD", max_length=3, description="Currency")

    @validator('symbol')
    def validate_symbol(cls, v):
        return v.upper().strip()

class StockCreate(StockBase):
    pass

class StockResponse(StockBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class StockUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = Field(None, max_length=1000)
    sector: Optional[str] = None
    exchange: Optional[str] = None
    currency: Optional[str] = None

# Position schemas
class PositionBase(BaseModel):
    stock_id: int = Field(..., description="Stock ID")
    quantity: float = Field(..., gt=0, description="Number of shares")
    purchase_price: float = Field(..., gt=0, description="Price per share at purchase")

class PositionCreate(PositionBase):
    pass

class PositionResponse(PositionBase):
    id: int
    user_id: int
    purchase_date: datetime
    created_at: datetime
    updated_at: datetime
    total_value: float
    stock: StockResponse
    
    class Config:
        from_attributes = True

class PositionUpdate(BaseModel):
    quantity: Optional[float] = Field(None, gt=0)
    purchase_price: Optional[float] = Field(None, gt=0)

# Watchlist schemas
class WatchlistBase(BaseModel):
    stock_id: int = Field(..., description="Stock ID")
    notes: Optional[str] = Field(None, max_length=500, description="Optional notes")

class WatchlistCreate(WatchlistBase):
    pass

class WatchlistResponse(WatchlistBase):
    id: int
    user_id: int
    date_added: datetime
    stock: StockResponse
    
    class Config:
        from_attributes = True

class WatchlistUpdate(BaseModel):
    notes: Optional[str] = Field(None, max_length=500)

# Portfolio summary schemas
class PortfolioSummary(BaseModel):
    total_value: float
    total_positions: int
    total_stocks: int
    positions: List[PositionResponse]

class WatchlistSummary(BaseModel):
    total_watched: int
    watchlist: List[WatchlistResponse]

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# Response schemas
class MessageResponse(BaseModel):
    message: str
    success: bool = True
    data: Optional[dict] = None

class ErrorResponse(BaseModel):
    message: str
    success: bool = False
    error_code: Optional[str] = None
    details: Optional[dict] = None
