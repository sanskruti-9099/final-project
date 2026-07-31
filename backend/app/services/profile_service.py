import os
import shutil
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.models.profile import UserProfile
from app.schemas.profile import ProfileUpdate
import uuid

UPLOAD_DIR = "uploads/profile"

class ProfileService:
    @staticmethod
    def get_profile(db: Session, user_id: int) -> UserProfile:
        profile = db.query(UserProfile).filter(UserProfile.id == user_id).first()
        if not profile:
            # Create a mock profile for user_id = 1 if it doesn't exist (since auth is missing)
            if user_id == 1:
                profile = UserProfile(
                    id=1,
                    full_name="John Doe",
                    email="john@gmail.com",
                    username="johndoe",
                    phone="+1XXXXXXXXXX",
                    gender="Male",
                    bio="AI Enthusiast"
                )
                db.add(profile)
                db.commit()
                db.refresh(profile)
            else:
                raise HTTPException(status_code=404, detail="Profile not found")
        return profile

    @staticmethod
    def update_profile(db: Session, user_id: int, profile_update: ProfileUpdate) -> UserProfile:
        profile = ProfileService.get_profile(db, user_id)
        
        update_data = profile_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(profile, key, value)
            
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    async def upload_image(db: Session, user_id: int, file: UploadFile) -> UserProfile:
        profile = ProfileService.get_profile(db, user_id)

        # Create directory if not exists
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # Generate unique filename
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        # Save file
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Update profile
        profile.profile_image = filename
        db.commit()
        db.refresh(profile)

        return profile
