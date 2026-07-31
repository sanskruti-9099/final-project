from typing import List, Dict, Any
from sqlalchemy.orm import Session

from app.models.flashcard import FlashcardSet


def create_flashcard_set(
    db: Session,
    *,
    topic: str,
    cards: List[Dict[str, Any]],
    model_used: str = "llama-3.1-8b-instant",
) -> FlashcardSet:
    """
    Persist a new flashcard set to the database.

    Parameters
    ----------
    db : Session
        SQLAlchemy database session.
    topic : str
        The requested topic.
    cards : List[Dict[str, Any]]
        The parsed JSON array of flashcards.
    model_used : str
        Identifier of the Groq model used.

    Returns
    -------
    FlashcardSet
        The created and persisted model instance.
    """
    db_obj = FlashcardSet(
        topic=topic,
        cards=cards,
        model_used=model_used,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
