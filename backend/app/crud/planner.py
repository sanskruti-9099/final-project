from typing import List, Dict, Any
from sqlalchemy.orm import Session

from app.models.planner import StudyPlan


def create_study_plan(
    db: Session,
    *,
    subjects: List[str],
    exam_date: str,
    plan: List[Dict[str, Any]],
    model_used: str = "llama-3.1-8b-instant",
) -> StudyPlan:
    """
    Persist a new study plan to the database.

    Parameters
    ----------
    db : Session
        SQLAlchemy database session.
    subjects : List[str]
        The requested subjects.
    exam_date : str
        The requested exam date.
    plan : List[Dict[str, Any]]
        The parsed JSON array of daily plans.
    model_used : str
        Identifier of the Groq model used.

    Returns
    -------
    StudyPlan
        The created and persisted model instance.
    """
    db_obj = StudyPlan(
        subjects=subjects,
        exam_date=exam_date,
        plan=plan,
        model_used=model_used,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
