from pydantic import BaseModel, Field


class SummaryRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=10,
        max_length=50000,
        description="The raw notes text to be summarized.",
        json_schema_extra={
            "example": "Photosynthesis is the process by which green plants..."
        },
    )


class SummaryResponse(BaseModel):
    success: bool = Field(..., description="Indicates if the request was successful.")
    summary: str = Field(..., description="The AI-generated summary of the notes.")
    id: int = Field(..., description="The database ID of the summary.")
