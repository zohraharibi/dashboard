#!/usr/bin/env python3
"""
Test script for the Trading Dashboard API endpoints.
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint."""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_signup():
    """Test user signup."""
    print("\n🔍 Testing user signup...")
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "full_name": "Test User",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/signup", json=user_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code in [200, 201]
    except Exception as e:
        print(f"❌ Signup test failed: {e}")
        return False

def test_login():
    """Test user login."""
    print("\n🔍 Testing user login...")
    login_data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and "access_token" in result:
            return result["access_token"]
        return None
    except Exception as e:
        print(f"❌ Login test failed: {e}")
        return None

def test_protected_endpoint(token):
    """Test protected endpoint with token."""
    print("\n🔍 Testing protected endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Protected endpoint test failed: {e}")
        return False

def main():
    """Run all API tests."""
    print("🧪 Starting API Tests")
    print("=" * 50)
    
    # Test health
    if not test_health():
        print("❌ Health check failed. Is the server running?")
        sys.exit(1)
    
    # Test signup
    signup_success = test_signup()
    if not signup_success:
        print("⚠️  Signup failed (user might already exist)")
    
    # Test login
    token = test_login()
    if not token:
        print("❌ Login failed")
        sys.exit(1)
    
    # Test protected endpoint
    if not test_protected_endpoint(token):
        print("❌ Protected endpoint test failed")
        sys.exit(1)
    
    print("\n✅ All tests passed!")
    print("🎉 API is working correctly!")

if __name__ == "__main__":
    main()
