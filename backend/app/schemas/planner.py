from typing import List
from pydantic import BaseModel, Field


class PlannerRequest(BaseModel):
    subjects: List[str] = Field(
        ...,
        min_items=1,
        max_items=10,
        description="The list of subjects to study.",
        json_schema_extra={"example": ["Python", "Math"]},
    )
    exam_date: str = Field(
        ...,
        description="The target date for the exam (e.g. YYYY-MM-DD or readable string).",
        json_schema_extra={"example": "2026-08-20"},
    )


class DailyPlanSchema(BaseModel):
    date: str = Field(..., description="The date or day of the plan (e.g. 'Day 1' or '2026-07-29').")
    tasks: List[str] = Field(..., description="List of tasks to study on this day.")


class PlannerResponse(BaseModel):
    success: bool = Field(..., description="Indicates if the request was successful.")
    plan: List[DailyPlanSchema] = Field(..., description="The generated study plan array.")
    plan_id: int = Field(..., description="The database ID of the study plan.")
