"""
Groq chat service.

Handles the interaction with the Groq API for the chat feature,
including prompt construction and response extraction.
"""

from groq import AsyncGroq

from app.core.config import get_settings
from app.core.exceptions import AppException
from app.core.logging import get_logger
from app.services.prompts import STUDY_ASSISTANT_SYSTEM_INSTRUCTION, build_chat_prompt

logger = get_logger(__name__)
settings = get_settings()

# ── SDK initialization (runs once at module import) ────────
client = AsyncGroq(api_key=settings.GROQ_API_KEY)


class ChatService:
    """
    Encapsulates Groq API calls for the chat feature.

    Injected into route handlers via ``get_chat_service()``.
    """

    def __init__(self, model_name: str = "llama-3.1-8b-instant") -> None:
        self.model_name = model_name
        logger.info("chat_service_init", model=model_name)

    async def generate_answer(self, question: str) -> str:
        """
        Send a question to Groq and return the text answer.

        Parameters
        ----------
        question : str
            The student's question.

        Returns
        -------
        str
            The AI-generated answer text.

        Raises
        ------
        AppException
            If the Groq API call fails or returns an empty response.
        """
        prompt = build_chat_prompt(question)
        logger.info("groq_request", question_length=len(question))

        try:
            response = await client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": STUDY_ASSISTANT_SYSTEM_INSTRUCTION},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=2048,
            )

            # Safety / empty-response guard
            if not response.choices or not response.choices[0].message.content:
                logger.warning("groq_empty_response")
                raise AppException(
                    message="The AI could not generate an answer. Please try rephrasing your question.",
                    status_code=502,
                )

            answer = response.choices[0].message.content.strip()
            logger.info("groq_response", answer_length=len(answer))
            return answer

        except AppException:
            raise  # re-raise our own exceptions
        except Exception as exc:
            logger.exception("groq_api_error", error=str(exc))
            raise AppException(
                message="Failed to get a response from the AI service. Please try again later.",
                status_code=502,
            ) from exc


# ── Dependency ─────────────────────────────────────────────

def get_chat_service() -> ChatService:
    """FastAPI dependency that provides a ChatService instance."""
    return ChatService()
