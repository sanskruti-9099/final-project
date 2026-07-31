from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.profile import ProfileUpdate, ProfileResponse, ProfileMessageResponse
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/profile", tags=["Profile"])

# Hardcoded for now since no auth exists
CURRENT_USER_ID = 1

@router.get("", response_model=ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    profile = ProfileService.get_profile(db, CURRENT_USER_ID)
    return {"success": True, "data": profile}

@router.put("", response_model=ProfileMessageResponse)
def update_profile(profile_update: ProfileUpdate, db: Session = Depends(get_db)):
    ProfileService.update_profile(db, CURRENT_USER_ID, profile_update)
    return {"success": True, "message": "Profile updated successfully."}

@router.post("/upload-image", response_model=ProfileMessageResponse)
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    await ProfileService.upload_image(db, CURRENT_USER_ID, file)
    return {"success": True, "message": "Profile image uploaded successfully."}
