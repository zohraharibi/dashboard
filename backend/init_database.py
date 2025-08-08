#!/usr/bin/env python3
"""
Database initialization script
Creates tables and populates with sample data
"""

from database import create_tables, get_db, test_connection
from models import User, Stock, Position, Watchlist
from sqlalchemy.orm import Session
import sys

def init_sample_stocks():
    """Initialize database with sample stock data"""
    
    # Get database session
    db = next(get_db())
    
    try:
        # Sample stocks data
        sample_stocks = [
            {"symbol": "AAPL", "name": "Apple Inc.", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "GOOGL", "name": "Alphabet Inc. Class A", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "MSFT", "name": "Microsoft Corporation", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "TSLA", "name": "Tesla, Inc.", "sector": "Automotive", "exchange": "NASDAQ"},
            
            {"symbol": "AMZN", "name": "Amazon.com, Inc.", "sector": "E-commerce", "exchange": "NASDAQ"},
            {"symbol": "NVDA", "name": "NVIDIA Corporation", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "META", "name": "Meta Platforms, Inc.", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "NFLX", "name": "Netflix, Inc.", "sector": "Entertainment", "exchange": "NASDAQ"},
            {"symbol": "AMD", "name": "Advanced Micro Devices, Inc.", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "CRM", "name": "Salesforce, Inc.", "sector": "Technology", "exchange": "NYSE"},
        ]
        
        # Check if stocks already exist
        existing_stocks = db.query(Stock).count()
        if existing_stocks > 0:
            print(f"📊 Database already contains {existing_stocks} stocks")
            return
        
        # Add sample stocks
        for stock_data in sample_stocks:
            # Check if stock already exists
            existing = db.query(Stock).filter(Stock.symbol == stock_data["symbol"]).first()
            if not existing:
                stock = Stock(**stock_data)
                db.add(stock)
        
        db.commit()
        print(f"✅ Added {len(sample_stocks)} sample stocks to database")
        
        # Display created stocks
        stocks = db.query(Stock).all()
        print("\n📈 Available stocks:")
        for stock in stocks:
            print(f"  • {stock.symbol}: {stock.name} ({stock.sector})")
            
    except Exception as e:
        print(f"❌ Error initializing sample data: {e}")
        db.rollback()
    finally:
        db.close()

def show_table_info():
    """Display information about created tables"""
    
    db = next(get_db())
    
    try:
        # Count records in each table
        user_count = db.query(User).count()
        stock_count = db.query(Stock).count()
        position_count = db.query(Position).count()
        watchlist_count = db.query(Watchlist).count()
        
        print("\n📊 Database Table Summary:")
        print(f"  👥 Users: {user_count}")
        print(f"  📈 Stocks: {stock_count}")
        print(f"  💼 Positions: {position_count}")
        print(f"  👀 Watchlist items: {watchlist_count}")
        
    except Exception as e:
        print(f"❌ Error querying database: {e}")
    finally:
        db.close()

def main():
    """Main initialization function"""
    
    print("🚀 Initializing Trading Dashboard Database")
    print("=" * 50)
    
    # Test database connection
    if not test_connection():
        print("❌ Database connection failed. Please check your configuration.")
        sys.exit(1)
    
    # Create all tables
    print("\n📋 Creating database tables...")
    create_tables()
    
    # Initialize with sample data
    print("\n📊 Adding sample stock data...")
    init_sample_stocks()
    
    # Show table information
    show_table_info()
    
    print("\n✅ Database initialization complete!")
    print("\n🎯 Next steps:")
    print("  1. Register users through the API")
    print("  2. Add stocks to watchlists")
    print("  3. Create positions for users")
    print("  4. Start trading!")

if __name__ == "__main__":
    main()
