from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.quiz import create_quiz
from app.schemas.quiz import QuizRequest, QuizResponse
from app.services.quiz_service import QuizService, get_quiz_service

router = APIRouter()

@router.post(
    "/quiz",
    response_model=QuizResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate a multiple-choice quiz",
)
async def generate_quiz(
    body: QuizRequest,
    db: Session = Depends(get_db),
    quiz_service: QuizService = Depends(get_quiz_service),
) -> QuizResponse:
    """
    Handle a quiz generation request.
    """
    questions = await quiz_service.generate_quiz(body.topic)

    db_quiz = create_quiz(
        db,
        topic=body.topic,
        questions=questions,
        model_used=quiz_service.model_name,
    )

    return QuizResponse(
        success=True, 
        questions=questions, 
        quiz_id=db_quiz.id
    )
