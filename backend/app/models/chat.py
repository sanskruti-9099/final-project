"""
ChatMessage ORM model.

Stores every question sent to the AI and the corresponding answer.
"""

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ChatMessage(Base):
    """Persisted chat interaction between a user and the Groq AI."""

    __tablename__ = "chat_messages"

    question: Mapped[str] = mapped_column(
        Text, nullable=False, comment="The user's question"
    )
    answer: Mapped[str] = mapped_column(
        Text, nullable=False, comment="The AI-generated answer"
    )
    model_used: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="llama-3.1-8b-instant",
        comment="Groq model identifier used for generation",
    )
