from sqlalchemy.orm import Session

from app.models.summary import NoteSummary


def create_note_summary(
    db: Session,
    *,
    original_text: str,
    summary_text: str,
    model_used: str = "llama-3.1-8b-instant",
) -> NoteSummary:
    """
    Persist a new note summary to the database.

    Parameters
    ----------
    db : Session
        SQLAlchemy database session.
    original_text : str
        The raw notes text provided by the user.
    summary_text : str
        The AI-generated summary.
    model_used : str
        Identifier of the Groq model used.

    Returns
    -------
    NoteSummary
        The created and persisted model instance.
    """
    db_obj = NoteSummary(
        original_text=original_text,
        summary_text=summary_text,
        model_used=model_used,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_note_summary(db: Session, summary_id: int) -> NoteSummary | None:
    """
    Retrieve a note summary by ID.
    """
    return db.query(NoteSummary).filter(NoteSummary.id == summary_id).first()
