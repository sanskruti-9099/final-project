from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.planner import create_study_plan
from app.schemas.planner import PlannerRequest, PlannerResponse
from app.services.planner_service import PlannerService, get_planner_service

router = APIRouter()

@router.post(
    "/planner",
    response_model=PlannerResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate a study plan",
)
async def generate_plan(
    body: PlannerRequest,
    db: Session = Depends(get_db),
    planner_service: PlannerService = Depends(get_planner_service),
) -> PlannerResponse:
    """
    Handle a study plan generation request.
    """
    plan = await planner_service.generate_plan(body.subjects, body.exam_date)

    db_plan = create_study_plan(
        db,
        subjects=body.subjects,
        exam_date=body.exam_date,
        plan=plan,
        model_used=planner_service.model_name,
    )

    return PlannerResponse(
        success=True, 
        plan=plan, 
        plan_id=db_plan.id
    )
