from typing import List
from pydantic import BaseModel, Field


class QuizRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="The topic to generate a quiz for.",
        json_schema_extra={"example": "Python"},
    )


class QuestionSchema(BaseModel):
    question: str = Field(..., description="The text of the question.")
    options: List[str] = Field(..., description="List of possible options (usually 4).")
    answer: str = Field(..., description="The correct answer exactly matching one of the options.")


class QuizResponse(BaseModel):
    success: bool = Field(..., description="Indicates if the request was successful.")
    questions: List[QuestionSchema] = Field(..., description="The generated questions.")
    quiz_id: int = Field(..., description="The database ID of the quiz.")
