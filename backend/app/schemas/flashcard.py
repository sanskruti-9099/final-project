from typing import List
from pydantic import BaseModel, Field


class FlashcardRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="The topic to generate flashcards for.",
        json_schema_extra={"example": "French Revolution"},
    )


class FlashcardSchema(BaseModel):
    front: str = Field(..., description="The front of the flashcard (concept/term).")
    back: str = Field(..., description="The back of the flashcard (definition/explanation).")


class FlashcardResponse(BaseModel):
    success: bool = Field(..., description="Indicates if the request was successful.")
    cards: List[FlashcardSchema] = Field(..., description="The generated flashcards.")
    set_id: int = Field(..., description="The database ID of the flashcard set.")
