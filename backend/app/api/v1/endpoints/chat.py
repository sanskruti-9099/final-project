"""
Chat endpoint — ``POST /api/v1/chat``

Accepts a study question, sends it to Groq, persists the exchange,
and returns the AI-generated answer.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.logging import get_logger
from app.crud.chat import create_chat_message, get_chat_history
from app.schemas.chat import ChatRequest, ChatResponse, ChatHistoryResponse
from app.services.chat_service import ChatService, get_chat_service

logger = get_logger(__name__)

router = APIRouter()


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Ask the AI Study Assistant",
    description=(
        "Send a study-related question to the Groq-powered AI assistant. "
        "The question and answer are persisted to the database for history."
    ),
    responses={
        200: {
            "description": "Successful AI response",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "answer": "Python is a high-level, interpreted programming language...",
                    }
                }
            },
        },
        422: {"description": "Validation error — question is missing or too long"},
        502: {"description": "AI service unavailable or returned an empty response"},
    },
)
async def ask_question(
    body: ChatRequest,
    db: Session = Depends(get_db),
    chat_service: ChatService = Depends(get_chat_service),
) -> ChatResponse:
    """
    Handle a chat request.

    1. Validate the incoming question (Pydantic).
    2. Send the question to the Groq API via ChatService.
    3. Persist the question + answer to MySQL via CRUD layer.
    4. Return the answer in the standard response envelope.
    """
    logger.info("chat_request_received", question=body.question[:100])

    # ── AI generation ──────────────────────────────────
    answer = await chat_service.generate_answer(body.question)

    # ── Persist to database ────────────────────────────
    create_chat_message(
        db,
        question=body.question,
        answer=answer,
        model_used=chat_service.model_name,
    )

    logger.info("chat_request_completed")

    return ChatResponse(success=True, answer=answer)


@router.get(
    "/history",
    response_model=ChatHistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Chat History",
    description="Retrieve a list of previous chat interactions ordered by newest first.",
)
async def get_history(
    limit: int = 50,
    db: Session = Depends(get_db),
) -> ChatHistoryResponse:
    """
    Handle a request to retrieve chat history.
    """
    history = get_chat_history(db, limit=limit)
    return ChatHistoryResponse(success=True, history=history)
