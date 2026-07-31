from typing import List, Dict, Any
from sqlalchemy.orm import Session

from app.models.quiz import Quiz


def create_quiz(
    db: Session,
    *,
    topic: str,
    questions: List[Dict[str, Any]],
    model_used: str = "llama-3.1-8b-instant",
) -> Quiz:
    """
    Persist a new quiz to the database.

    Parameters
    ----------
    db : Session
        SQLAlchemy database session.
    topic : str
        The requested topic.
    questions : List[Dict[str, Any]]
        The parsed JSON array of questions.
    model_used : str
        Identifier of the Groq model used.

    Returns
    -------
    Quiz
        The created and persisted model instance.
    """
    db_obj = Quiz(
        topic=topic,
        questions=questions,
        model_used=model_used,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
