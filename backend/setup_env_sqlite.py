#!/usr/bin/env python3
"""
Script to set up the environment file with SQLite for quick testing.
"""
import os

def create_env_file():
    """Create the .env file with SQLite for local testing."""
    env_content = """# Database Configuration (SQLite for local testing)
DATABASE_URL=sqlite:///./trading_dashboard.db

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production-zohra-dashboard-2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENVIRONMENT=development
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ .env file created successfully!")
        print("📝 Environment variables configured:")
        print("   - DATABASE_URL: SQLite (local file)")
        print("   - SECRET_KEY: JWT secret key")
        print("   - ALGORITHM: HS256")
        print("   - ACCESS_TOKEN_EXPIRE_MINUTES: 30")
        print("\n💾 Using SQLite for quick testing")
        print("🔄 Switch back to PostgreSQL later by running setup_env.py")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

if __name__ == "__main__":
    create_env_file()
