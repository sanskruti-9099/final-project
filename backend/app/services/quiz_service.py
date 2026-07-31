import json
from typing import List, Dict, Any
from groq import AsyncGroq

from app.core.config import get_settings
from app.core.exceptions import AppException
from app.core.logging import get_logger
from app.services.prompts import QUIZ_SYSTEM_INSTRUCTION, build_quiz_prompt

logger = get_logger(__name__)
settings = get_settings()

client = AsyncGroq(api_key=settings.GROQ_API_KEY)


class QuizService:
    def __init__(self, model_name: str = "llama-3.1-8b-instant") -> None:
        self.model_name = model_name
        logger.info("quiz_service_init", model=model_name)

    async def generate_quiz(self, topic: str) -> List[Dict[str, Any]]:
        prompt = build_quiz_prompt(topic)
        logger.info("groq_quiz_request", topic=topic)

        try:
            response = await client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": QUIZ_SYSTEM_INSTRUCTION},
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.7,
                max_tokens=3000,
            )

            if not response.choices or not response.choices[0].message.content:
                raise AppException(
                    message="The AI could not generate a quiz.",
                    status_code=502,
                )

            quiz_json_str = response.choices[0].message.content.strip()
            quiz_data = json.loads(quiz_json_str)
            
            if "questions" not in quiz_data or not isinstance(quiz_data["questions"], list):
                 raise AppException(
                    message="The AI returned an invalid quiz format.",
                    status_code=502,
                )

            questions = quiz_data["questions"]
            logger.info("groq_quiz_response", num_questions=len(questions))
            return questions

        except json.JSONDecodeError as exc:
            logger.exception("groq_json_parse_error", error=str(exc))
            raise AppException(
                message="Failed to parse the AI's response.",
                status_code=502,
            ) from exc
        except AppException:
            raise
        except Exception as exc:
            logger.exception("groq_api_error", error=str(exc))
            raise AppException(
                message="Failed to get a response from the AI service. Please try again later.",
                status_code=502,
            ) from exc


def get_quiz_service() -> QuizService:
    return QuizService()
