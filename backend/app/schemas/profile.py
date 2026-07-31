from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    bio: Optional[str] = None

class ProfileUpdate(ProfileBase):
    pass

class ProfileRead(ProfileBase):
    id: int
    email: EmailStr
    profile_image: Optional[str] = None

    class Config:
        from_attributes = True

class ProfileResponse(BaseModel):
    success: bool
    data: ProfileRead

class ProfileMessageResponse(BaseModel):
    success: bool
    message: str
