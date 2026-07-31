"""
Shared base schemas used across the application.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """Base schema with ORM-mode enabled for SQLAlchemy model serialization."""

    model_config = ConfigDict(from_attributes=True)


class TimestampSchema(BaseSchema):
    """Schema mixin that exposes the common timestamp fields."""

    id: int
    created_at: datetime
    updated_at: datetime


class MessageResponse(BaseModel):
    """Generic API message response."""

    success: bool = True
    message: str
