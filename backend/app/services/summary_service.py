"""
Groq summary service.
"""

from groq import AsyncGroq

from app.core.config import get_settings
from app.core.exceptions import AppException
from app.core.logging import get_logger
from app.services.prompts import SUMMARY_SYSTEM_INSTRUCTION, build_summary_prompt

logger = get_logger(__name__)
settings = get_settings()

client = AsyncGroq(api_key=settings.GROQ_API_KEY)


class SummaryService:
    def __init__(self, model_name: str = "llama-3.1-8b-instant") -> None:
        self.model_name = model_name
        logger.info("summary_service_init", model=model_name)

    async def generate_summary(self, text: str) -> str:
        prompt = build_summary_prompt(text)
        logger.info("groq_summary_request", text_length=len(text))

        try:
            response = await client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": SUMMARY_SYSTEM_INSTRUCTION},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
                max_tokens=3000,
            )

            if not response.choices or not response.choices[0].message.content:
                raise AppException(
                    message="The AI could not generate a summary.",
                    status_code=502,
                )

            summary = response.choices[0].message.content.strip()
            logger.info("groq_summary_response", summary_length=len(summary))
            return summary

        except AppException:
            raise
        except Exception as exc:
            logger.exception("groq_api_error", error=str(exc))
            raise AppException(
                message="Failed to get a response from the AI service. Please try again later.",
                status_code=502,
            ) from exc


def get_summary_service() -> SummaryService:
    return SummaryService()
