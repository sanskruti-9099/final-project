from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.summary import create_note_summary, get_note_summary
from app.schemas.summary import SummaryRequest, SummaryResponse
from app.services.summary_service import SummaryService, get_summary_service

router = APIRouter()

@router.post(
    "/summary",
    response_model=SummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Summarize Study Notes",
)
async def summarize_notes(
    body: SummaryRequest,
    db: Session = Depends(get_db),
    summary_service: SummaryService = Depends(get_summary_service),
) -> SummaryResponse:
    """
    Handle a summarization request.
    """
    summary = await summary_service.generate_summary(body.text)

    db_summary = create_note_summary(
        db,
        original_text=body.text,
        summary_text=summary,
        model_used=summary_service.model_name,
    )

    return SummaryResponse(success=True, summary=summary, id=db_summary.id)


@router.get(
    "/summary/{summary_id}/download",
    response_class=PlainTextResponse,
    summary="Download Summary as text file",
)
async def download_summary(
    summary_id: int,
    db: Session = Depends(get_db),
):
    """
    Download a previously generated summary as a Markdown/text file.
    """
    summary = get_note_summary(db, summary_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")

    content = f"# Notes Summary\n\n{summary.summary_text}\n\n---\n## Original Notes\n\n{summary.original_text}"

    return PlainTextResponse(
        content=content,
        headers={
            "Content-Disposition": f"attachment; filename=summary_{summary_id}.txt"
        }
    )
