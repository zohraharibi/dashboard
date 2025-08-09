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
            {"symbol": "AAPL", "name": "Apple Inc.", "description": "Technology company that designs, develops, and sells consumer electronics, computer software, and online services.", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "GOOGL", "name": "Alphabet Inc. Class A", "description": "Multinational technology conglomerate holding company specializing in Internet-related services and products.", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "MSFT", "name": "Microsoft Corporation", "description": "Multinational technology corporation that produces computer software, consumer electronics, personal computers, and related services.", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "TSLA", "name": "Tesla, Inc.", "description": "Electric vehicle and clean energy company that designs, manufactures, and sells electric cars, energy storage systems, and solar panels.", "sector": "Automotive", "exchange": "NASDAQ"},
            
            {"symbol": "AMZN", "name": "Amazon.com, Inc.", "description": "Multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.", "sector": "E-commerce", "exchange": "NASDAQ"},
            {"symbol": "NVDA", "name": "NVIDIA Corporation", "description": "Multinational technology company that designs graphics processing units (GPUs) for gaming, cryptocurrency mining, and professional markets.", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "META", "name": "Meta Platforms, Inc.", "description": "Technology conglomerate that owns and operates Facebook, Instagram, WhatsApp, and other social media platforms.", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "NFLX", "name": "Netflix, Inc.", "description": "Streaming entertainment service with over 200 million paid memberships in over 190 countries enjoying TV series, documentaries and feature films.", "sector": "Entertainment", "exchange": "NASDAQ"},
            {"symbol": "AMD", "name": "Advanced Micro Devices, Inc.", "description": "Multinational semiconductor company that develops computer processors and related technologies for business and consumer markets.", "sector": "Technology", "exchange": "NASDAQ"},
            {"symbol": "CRM", "name": "Salesforce, Inc.", "description": "Cloud-based software company that provides customer relationship management (CRM) service and enterprise cloud computing.", "sector": "Technology", "exchange": "NYSE"},
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

def init_sample_positions(user_id: int):
    """Initialize database with sample position data for a user"""
    
    db = next(get_db())
    
    try:
        # Check if positions already exist for this user
        existing_positions = db.query(Position).filter(Position.user_id == user_id).count()
        if existing_positions > 0:
            print(f"💼 User {user_id} already has {existing_positions} positions")
            return
        
        # Get stock IDs for the positions
        aapl_stock = db.query(Stock).filter(Stock.symbol == "AAPL").first()
        tsla_stock = db.query(Stock).filter(Stock.symbol == "TSLA").first()
        
        if not aapl_stock or not tsla_stock:
            print("❌ Required stocks (AAPL, TSLA) not found in database")
            return
        
        # Sample positions data
        sample_positions = [
            {
                "user_id": user_id,
                "stock_id": aapl_stock.id,
                "quantity": 50,
                "purchase_price": 185.25,
                "notes": "Long-term investment in Apple ecosystem"
            },
            {
                "user_id": user_id,
                "stock_id": tsla_stock.id,
                "quantity": 25,
                "purchase_price": 242.80,
                "notes": "EV market growth play"
            }
        ]
        
        # Add sample positions
        for position_data in sample_positions:
            position = Position(**position_data)
            db.add(position)
        
        db.commit()
        print(f"✅ Added {len(sample_positions)} sample positions for user {user_id}")
        
        # Display created positions
        positions = db.query(Position).filter(Position.user_id == user_id).all()
        print(f"\n💼 User {user_id} positions:")
        for position in positions:
            stock = db.query(Stock).filter(Stock.id == position.stock_id).first()
            total_value = position.quantity * position.purchase_price
            print(f"  • {stock.symbol}: {position.quantity} shares @ ${position.purchase_price:.2f} = ${total_value:.2f}")
            
    except Exception as e:
        print(f"❌ Error initializing position data: {e}")
        db.rollback()
    finally:
        db.close()

def init_sample_watchlist(user_id: int):
    """Initialize database with sample watchlist data for a user"""
    
    db = next(get_db())
    
    try:
        # Check if watchlist items already exist for this user
        existing_watchlist = db.query(Watchlist).filter(Watchlist.user_id == user_id).count()
        if existing_watchlist > 0:
            print(f"👀 User {user_id} already has {existing_watchlist} watchlist items")
            return
        
        # Get stock IDs for the watchlist
        nvda_stock = db.query(Stock).filter(Stock.symbol == "NVDA").first()
        meta_stock = db.query(Stock).filter(Stock.symbol == "META").first()
        
        if not nvda_stock or not meta_stock:
            print("❌ Required stocks (NVDA, META) not found in database")
            return
        
        # Sample watchlist data
        sample_watchlist = [
            {
                "user_id": user_id,
                "stock_id": nvda_stock.id,
                "notes": "Watching for AI/GPU market developments"
            },
            {
                "user_id": user_id,
                "stock_id": meta_stock.id,
                "notes": "Monitoring metaverse and VR investments"
            }
        ]
        
        # Add sample watchlist items
        for watchlist_data in sample_watchlist:
            watchlist_item = Watchlist(**watchlist_data)
            db.add(watchlist_item)
        
        db.commit()
        print(f"✅ Added {len(sample_watchlist)} sample watchlist items for user {user_id}")
        
        # Display created watchlist items
        watchlist_items = db.query(Watchlist).filter(Watchlist.user_id == user_id).all()
        print(f"\n👀 User {user_id} watchlist:")
        for item in watchlist_items:
            stock = db.query(Stock).filter(Stock.id == item.stock_id).first()
            print(f"  • {stock.symbol}: {stock.name}")
            if item.notes:
                print(f"    Notes: {item.notes}")
            
    except Exception as e:
        print(f"❌ Error initializing watchlist data: {e}")
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
