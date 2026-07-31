"""
Google Gemini API client.

Provides a thin wrapper that initializes the SDK once using
the GEMINI_API_KEY from settings.
"""

import google.generativeai as genai

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()

# ── SDK initialization ─────────────────────────────────
genai.configure(api_key=settings.GEMINI_API_KEY)


def get_gemini_model(model_name: str = "gemini-2.0-flash") -> genai.GenerativeModel:
    """
    Return a configured ``GenerativeModel`` instance.

    Parameters
    ----------
    model_name : str
        The Gemini model identifier (default: ``gemini-2.0-flash``).
    """
    logger.info("gemini_model_init", model=model_name)
    return genai.GenerativeModel(model_name)
