from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from datetime import timedelta
from database import get_db
from schemas import UserCreate, UserLogin, UserResponse, Token, MessageResponse, ErrorResponse
from auth import authenticate_user, get_current_active_user, create_user_token, ACCESS_TOKEN_EXPIRE_MINUTES
from user_service import UserService
from pydantic import ValidationError

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account."""
    try:
        user = UserService.create_user(db, user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation error: {e}"
        )
    except Exception as e:
        print(f"❌ Signup error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during signup"
        )

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
    try:
        user = authenticate_user(db, user_credentials.email, user_credentials.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is deactivated. Please contact support."
            )
        
        # Update last login
        UserService.update_last_login(db, user.id)
        
        # Create access token
        token_data = create_user_token(user)
        
        print(f"✅ User logged in successfully: {user.email}")
        return token_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during login"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_active_user)):
    """Get current authenticated user information."""
    return current_user

@router.post("/logout", response_model=MessageResponse)
async def logout_user(current_user = Depends(get_current_active_user)):
    """Logout user (client should remove token from storage)."""
    print(f"✅ User logged out: {current_user.email}")
    return MessageResponse(
        message=f"Successfully logged out user: {current_user.username}",
        success=True,
        data={"user_id": current_user.id}
    )

@router.post("/verify-token", response_model=UserResponse)
async def verify_token(current_user = Depends(get_current_active_user)):
    """Verify if the current token is valid and return user info."""
    return current_user

@router.post("/refresh-token", response_model=Token)
async def refresh_token(current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Refresh the access token for the current user."""
    try:
        # Update last login
        UserService.update_last_login(db, current_user.id)
        
        # Create new access token
        token_data = create_user_token(current_user)
        
        print(f"✅ Token refreshed for user: {current_user.email}")
        return token_data
        
    except Exception as e:
        print(f"❌ Token refresh error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during token refresh"
        )

# Additional user management endpoints (optional)
@router.get("/users/me/profile", response_model=UserResponse)
async def get_user_profile(current_user = Depends(get_current_active_user)):
    """Get detailed user profile information."""
    return current_user

@router.post("/users/me/deactivate", response_model=MessageResponse)
async def deactivate_own_account(
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Allow user to deactivate their own account."""
    try:
        success = UserService.deactivate_user(db, current_user.id)
        if success:
            return MessageResponse(
                message="Account deactivated successfully",
                success=True,
                data={"user_id": current_user.id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to deactivate account"
            )
    except Exception as e:
        print(f"❌ Account deactivation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during account deactivation"
        )
