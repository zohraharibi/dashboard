from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Import all models
from models import Base, User, Stock, Position, Watchlist

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine with PostgreSQL-specific settings
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={"sslmode": "require"}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
def create_tables():
    """Create all database tables."""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
        print("📊 Tables created: users, stocks, positions, watchlist")
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")

# Dependency to get database session
def get_db():
    """Get database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Test database connection
def test_connection():
    """Test database connection."""
    try:
        # Check if DATABASE_URL is set
        if not DATABASE_URL:
            print("❌ DATABASE_URL environment variable not set")
            return False
            
        with engine.connect() as connection:
            from sqlalchemy import text
            result = connection.execute(text("SELECT 1"))
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
