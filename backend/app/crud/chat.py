"""
CRUD operations for the ChatMessage model.

Pure data-access layer — no business logic or API concerns.
"""

from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.models.chat import ChatMessage

logger = get_logger(__name__)


def create_chat_message(
    db: Session,
    *,
    question: str,
    answer: str,
    model_used: str = "llama-3.1-8b-instant",
) -> ChatMessage:
    """
    Persist a new chat interaction to the database.

    Parameters
    ----------
    db : Session
        Active SQLAlchemy session (injected via ``get_db``).
    question : str
        The student's original question.
    answer : str
        The AI-generated answer.
    model_used : str
        Identifier of the Groq model used.

    Returns
    -------
    ChatMessage
        The newly created, committed ORM instance.
    """
    chat_message = ChatMessage(
        question=question,
        answer=answer,
        model_used=model_used,
    )
    db.add(chat_message)
    db.commit()
    db.refresh(chat_message)

    logger.info(
        "chat_message_saved",
        chat_id=chat_message.id,
        question_length=len(question),
        answer_length=len(answer),
    )
    return chat_message


def get_chat_history(db: Session, limit: int = 50) -> list[ChatMessage]:
    """
    Retrieve previous chat interactions from the database.

    Parameters
    ----------
    db : Session
        Active SQLAlchemy session.
    limit : int
        Maximum number of records to retrieve (default: 50).

    Returns
    -------
    list[ChatMessage]
        List of chat messages ordered by creation date descending.
    """
    return db.query(ChatMessage).order_by(ChatMessage.created_at.desc()).limit(limit).all()
