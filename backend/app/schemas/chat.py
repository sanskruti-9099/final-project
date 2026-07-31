"""
Pydantic schemas for the Chat feature.
"""

from datetime import datetime

from pydantic import BaseModel, Field


# ── Request ───────────────────────────────────────────────


class ChatRequest(BaseModel):
    """Incoming chat request body.

    Attributes:
        question: The study-related question to ask the AI.
    """

    question: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="The study-related question to ask the AI.",
        examples=["Explain Python"],
    )


# ── Response ──────────────────────────────────────────────


class ChatResponse(BaseModel):
    """Successful chat response.

    Attributes:
        success: Always ``True`` for successful responses.
        answer: The AI-generated answer.
    """

    success: bool = True
    answer: str = Field(
        ...,
        description="The AI-generated answer.",
    )


class ChatHistoryItem(BaseModel):
    """Single chat history record returned from the database."""

    model_config = {"from_attributes": True}

    id: int
    question: str
    answer: str
    model_used: str
    created_at: datetime


class ChatHistoryResponse(BaseModel):
    success: bool = True
    history: list[ChatHistoryItem]

