import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from datetime import timedelta

from app.api.deps import get_db, get_current_user
from app.crud.crud_user import create_user, get_user_by_email, get_user_by_username, update_user
from app.schemas.user import UserCreate, UserResponse, UserUpdate, LoginRequest
from app.schemas.token import Token
from app.core.security import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.models.user import User

router = APIRouter()

@router.post("/register")
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if user_in.password != user_in.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    if get_user_by_email(db, email=user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")
        
    if get_user_by_username(db, username=user_in.username):
        raise HTTPException(status_code=400, detail="Username already registered")
        
    create_user(db, user_in=user_in)
    return {"success": True, "message": "Registration successful."}

@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=login_data.email)
    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    return {
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "username": user.username,
            "profile_image": user.profile_image
        }
    }

@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    user_in: UserUpdate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_in.username and user_in.username != current_user.username:
        if get_user_by_username(db, username=user_in.username):
            raise HTTPException(status_code=400, detail="Username already registered")
            
    updated = update_user(db, db_user=current_user, user_in=user_in)
    return updated

@router.post("/upload-profile-image")
def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    os.makedirs("uploads/profile", exist_ok=True)
    file_ext = os.path.splitext(file.filename)[1]
    file_path = f"uploads/profile/{current_user.id}{file_ext}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    current_user.profile_image = f"/{file_path}"
    db.commit()
    
    return {"success": True, "profile_image": current_user.profile_image}

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    # JWT is stateless, invalidation is typically handled frontend-side
    # but we can return success here.
    return {"success": True, "message": "Successfully logged out."}
