from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    positions = relationship("Position", back_populates="user", cascade="all, delete-orphan")
    watchlist = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    trade_history = relationship("TradeHistory", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', username='{self.username}')>"


class Stock(Base):
    __tablename__ = "stocks"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(10), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    sector = Column(String(100), nullable=True)
    exchange = Column(String(50), nullable=True)
    currency = Column(String(3), default="USD", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    positions = relationship("Position", back_populates="stock", cascade="all, delete-orphan")
    watchlist = relationship("Watchlist", back_populates="stock", cascade="all, delete-orphan")
    trade_history = relationship("TradeHistory", back_populates="stock", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Stock(id={self.id}, symbol='{self.symbol}', name='{self.name}')>"


class Position(Base):
    __tablename__ = "positions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    purchase_price = Column(Float, nullable=False)
    purchase_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="positions")
    stock = relationship("Stock", back_populates="positions")

    def __repr__(self):
        return f"<Position(id={self.id}, user_id={self.user_id}, stock_id={self.stock_id}, quantity={self.quantity})>"

    @property
    def total_value(self):
        """Calculate total value of position at purchase price"""
        return self.quantity * self.purchase_price


class Watchlist(Base):
    __tablename__ = "watchlist"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False)
    date_added = Column(DateTime, default=datetime.utcnow, nullable=False)
    notes = Column(String(500), nullable=True)  # Optional notes about why stock is watched

    # Relationships
    user = relationship("User", back_populates="watchlist")
    stock = relationship("Stock", back_populates="watchlist")

    def __repr__(self):
        return f"<Watchlist(id={self.id}, user_id={self.user_id}, stock_id={self.stock_id})>"

    class Config:
        # Ensure unique combination of user_id and stock_id
        __table_args__ = (
            {'extend_existing': True}
        )


class TradeHistory(Base):
    __tablename__ = "trade_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False)
    trade_type = Column(String(10), nullable=False)  # 'BUY' or 'SELL'
    quantity = Column(Float, nullable=False)
    price_per_share = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)  # quantity * price_per_share
    trade_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    notes = Column(String(500), nullable=True)  # Optional notes about the trade

    # Relationships
    user = relationship("User", back_populates="trade_history")
    stock = relationship("Stock", back_populates="trade_history")

    def __repr__(self):
        return f"<TradeHistory(id={self.id}, user_id={self.user_id}, stock_id={self.stock_id}, trade_type='{self.trade_type}', quantity={self.quantity}, price={self.price_per_share})>"
