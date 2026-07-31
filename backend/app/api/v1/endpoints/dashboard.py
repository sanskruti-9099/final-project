"""
Dashboard endpoint — ``GET /api/v1/dashboard``

Aggregates statistics, recent activities, and today's goals for the UI.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from typing import List
from app.schemas.dashboard import DashboardResponse, RecentActivityItem
from app.services.dashboard_service import DashboardService, get_dashboard_service

router = APIRouter()


@router.get(
    "/dashboard",
    response_model=DashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Dashboard Data",
    description="Returns aggregated metrics, study goals, and recent history for the Dashboard UI.",
)
async def get_dashboard(
    db: Session = Depends(get_db),
    dashboard_service: DashboardService = Depends(get_dashboard_service),
) -> DashboardResponse:
    """
    Handle a request to retrieve dashboard data.
    """
    return dashboard_service.get_dashboard_data()

@router.get(
    "/history/all",
    response_model=List[RecentActivityItem],
    status_code=status.HTTP_200_OK,
    summary="Get All History",
    description="Returns all history activities across features.",
)
async def get_all_history(
    limit: int = 100,
    db: Session = Depends(get_db),
    dashboard_service: DashboardService = Depends(get_dashboard_service),
) -> List[RecentActivityItem]:
    """
    Handle a request to retrieve all history activities.
    """
    return dashboard_service.get_all_history(limit=limit)
