from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import User
from schemas import UserCreate, UserUpdate
from auth import get_password_hash
from datetime import datetime
from typing import Optional, List

class UserService:
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if user already exists
        existing_user = db.query(User).filter(
            (User.email == user_data.email.lower()) | 
            (User.username == user_data.username.lower())
        ).first()
        
        if existing_user:
            if existing_user.email == user_data.email.lower():
                raise ValueError("Email already registered")
            if existing_user.username == user_data.username.lower():
                raise ValueError("Username already taken")
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email.lower(),
            username=user_data.username.lower(),
            full_name=user_data.full_name,
            hashed_password=hashed_password,
            is_active=True,
            is_verified=False
        )
        
        try:
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            print(f"✅ User created successfully: {db_user.email}")
            return db_user
        except IntegrityError as e:
            db.rollback()
            print(f"❌ User creation failed: {e}")
            raise ValueError("User creation failed due to data conflict")
        except Exception as e:
            db.rollback()
            print(f"❌ Unexpected error during user creation: {e}")
            raise ValueError("User creation failed")
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        try:
            return db.query(User).filter(User.email == email.lower()).first()
        except Exception as e:
            print(f"❌ Error getting user by email: {e}")
            return None
    
    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        """Get user by username."""
        try:
            return db.query(User).filter(User.username == username.lower()).first()
        except Exception as e:
            print(f"❌ Error getting user by username: {e}")
            return None
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID."""
        try:
            return db.query(User).filter(User.id == user_id).first()
        except Exception as e:
            print(f"❌ Error getting user by ID: {e}")
            return None
    
    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination."""
        try:
            return db.query(User).offset(skip).limit(limit).all()
        except Exception as e:
            print(f"❌ Error getting all users: {e}")
            return []
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user information."""
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return None
            
            update_data = user_data.dict(exclude_unset=True)
            
            # Check for email/username conflicts
            if "email" in update_data:
                existing_user = db.query(User).filter(
                    User.email == update_data["email"].lower(),
                    User.id != user_id
                ).first()
                if existing_user:
                    raise ValueError("Email already in use by another user")
                update_data["email"] = update_data["email"].lower()
            
            if "username" in update_data:
                existing_user = db.query(User).filter(
                    User.username == update_data["username"].lower(),
                    User.id != user_id
                ).first()
                if existing_user:
                    raise ValueError("Username already in use by another user")
                update_data["username"] = update_data["username"].lower()
            
            # Hash password if provided
            if "password" in update_data:
                update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
            
            for field, value in update_data.items():
                setattr(user, field, value)
            
            db.commit()
            db.refresh(user)
            print(f"✅ User updated successfully: {user.email}")
            return user
        except IntegrityError as e:
            db.rollback()
            print(f"❌ User update failed: {e}")
            raise ValueError("Update failed due to data conflict")
        except Exception as e:
            db.rollback()
            print(f"❌ Unexpected error during user update: {e}")
            raise ValueError("User update failed")
    
    @staticmethod
    def update_last_login(db: Session, user_id: int) -> None:
        """Update user's last login timestamp."""
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.last_login = datetime.utcnow()
                db.commit()
                print(f"✅ Last login updated for user: {user.email}")
        except Exception as e:
            db.rollback()
            print(f"❌ Error updating last login: {e}")
    
    @staticmethod
    def deactivate_user(db: Session, user_id: int) -> bool:
        """Deactivate a user account."""
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.is_active = False
                db.commit()
                print(f"✅ User deactivated: {user.email}")
                return True
            return False
        except Exception as e:
            db.rollback()
            print(f"❌ Error deactivating user: {e}")
            return False
    
    @staticmethod
    def activate_user(db: Session, user_id: int) -> bool:
        """Activate a user account."""
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.is_active = True
                db.commit()
                print(f"✅ User activated: {user.email}")
                return True
            return False
        except Exception as e:
            db.rollback()
            print(f"❌ Error activating user: {e}")
            return False
    
    @staticmethod
    def verify_user(db: Session, user_id: int) -> bool:
        """Verify a user account."""
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.is_verified = True
                db.commit()
                print(f"✅ User verified: {user.email}")
                return True
            return False
        except Exception as e:
            db.rollback()
            print(f"❌ Error verifying user: {e}")
            return False
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """Delete a user account (soft delete by deactivating)."""
        try:
            return UserService.deactivate_user(db, user_id)
        except Exception as e:
            print(f"❌ Error deleting user: {e}")
            return False
