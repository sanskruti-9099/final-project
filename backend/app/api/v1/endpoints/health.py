"""
Health-check endpoint.

Verifies the API is reachable and (optionally) the database connection is alive.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.base import MessageResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Returns the health status of the API and verifies the database connection.",
)
def health_check(db: Session = Depends(get_db)) -> MessageResponse:
    """Ping the database and return an OK response."""
    db.execute(text("SELECT 1"))
    return MessageResponse(success=True, message="API is healthy. Database connected.")
