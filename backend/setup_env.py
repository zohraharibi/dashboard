#!/usr/bin/env python3
"""
Script to set up the environment file for the Trading Dashboard API.
"""
import os

def create_env_file():
    """Create the .env file with database credentials."""
    env_content = """# Database Configuration (with SSL parameters for Render PostgreSQL)
DATABASE_URL=postgresql://zohra:KrSLEJJSwNUFdIvpNDOzD5ydLtWtCKOk@dpg-ct8uqo08fa8c73bfqbf0-a.oregon-postgres.render.com/dashboard_db?sslmode=require

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
        print("   - DATABASE_URL: PostgreSQL connection with SSL")
        print("   - SECRET_KEY: JWT secret key")
        print("   - ALGORITHM: HS256")
        print("   - ACCESS_TOKEN_EXPIRE_MINUTES: 30")
        print("\n🔒 SSL Configuration added for Render PostgreSQL")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

if __name__ == "__main__":
    create_env_file()
