#!/usr/bin/env python3
"""
Startup script for the Trading Dashboard API server with PostgreSQL.
"""
import uvicorn
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def main():
    """Start the FastAPI server."""
    print("🚀 Starting Trading Dashboard API with PostgreSQL...")
    print("=" * 60)
    print("📊 API Server: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔧 Interactive API Explorer: http://localhost:8000/redoc")
    print("🗄️  Database: PostgreSQL (Render)")
    print("=" * 60)
    print("🔑 Available Endpoints:")
    print("   POST /auth/signup     - Register new user")
    print("   POST /auth/login      - User login")
    print("   GET  /auth/me         - Get current user")
    print("   POST /auth/logout     - User logout")
    print("   POST /auth/verify-token - Verify token")
    print("   GET  /health          - Health check")
    print("=" * 60)
    print("🌟 Ready to accept requests!")
    print()
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=int(os.getenv("PORT", "8000")),  # Critical for Render
            reload=False,  # Disable reload in production
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    main()
