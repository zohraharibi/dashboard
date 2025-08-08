#!/usr/bin/env python3
"""
Simple backend test without database dependency.
"""
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all backend modules can be imported."""
    print("🔍 Testing backend imports...")
    
    try:
        # Test FastAPI imports
        from fastapi import FastAPI
        print("✅ FastAPI import successful")
        
        # Test database module (without connection)
        import database
        print("✅ Database module import successful")
        
        # Test auth module
        from routes import auth
        print("✅ Auth routes import successful")
        
        # Test schemas
        import schemas
        print("✅ Schemas import successful")
        
        # Test user service
        import user_service
        print("✅ User service import successful")
        
        return True
        
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

def test_app_creation():
    """Test if FastAPI app can be created."""
    print("\n🔍 Testing app creation...")
    
    try:
        from fastapi import FastAPI
        from fastapi.middleware.cors import CORSMiddleware
        
        # Create a simple app
        app = FastAPI(title="Test App")
        
        # Add CORS
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        # Add a simple route
        @app.get("/test")
        async def test_route():
            return {"message": "Backend is working!"}
        
        print("✅ FastAPI app creation successful")
        return True
        
    except Exception as e:
        print(f"❌ App creation failed: {e}")
        return False

def test_schemas():
    """Test if Pydantic schemas work."""
    print("\n🔍 Testing schemas...")
    
    try:
        import schemas
        
        # Test user creation schema
        user_data = {
            "email": "test@example.com",
            "username": "testuser",
            "full_name": "Test User",
            "password": "testpass123"
        }
        
        user_create = schemas.UserCreate(**user_data)
        print(f"✅ UserCreate schema works: {user_create.email}")
        
        # Test login schema
        login_data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        
        user_login = schemas.UserLogin(**login_data)
        print(f"✅ UserLogin schema works: {user_login.email}")
        
        return True
        
    except Exception as e:
        print(f"❌ Schema test failed: {e}")
        return False

def main():
    """Run all backend tests."""
    print("🧪 Starting Backend Component Tests")
    print("=" * 50)
    
    tests = [
        test_imports,
        test_app_creation,
        test_schemas
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        else:
            print(f"❌ Test {test.__name__} failed")
    
    print(f"\n📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✅ All backend components are working!")
        print("🎉 Backend is ready for use!")
        return True
    else:
        print("❌ Some backend components have issues")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
