from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.flashcard import create_flashcard_set
from app.schemas.flashcard import FlashcardRequest, FlashcardResponse
from app.services.flashcard_service import FlashcardService, get_flashcard_service

router = APIRouter()

@router.post(
    "/flashcards",
    response_model=FlashcardResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate a set of flashcards",
)
async def generate_flashcards(
    body: FlashcardRequest,
    db: Session = Depends(get_db),
    flashcard_service: FlashcardService = Depends(get_flashcard_service),
) -> FlashcardResponse:
    """
    Handle a flashcard generation request.
    """
    cards = await flashcard_service.generate_flashcards(body.topic)

    db_set = create_flashcard_set(
        db,
        topic=body.topic,
        cards=cards,
        model_used=flashcard_service.model_name,
    )

    return FlashcardResponse(
        success=True, 
        cards=cards, 
        set_id=db_set.id
    )
