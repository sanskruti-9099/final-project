"""
Models sub-package.

Import all models here so Alembic auto-generates migrations correctly.
"""

from app.models.base import Base  # noqa: F401
from app.models.chat import ChatMessage  # noqa: F401
from app.models.summary import NoteSummary  # noqa: F401
from app.models.quiz import Quiz  # noqa: F401
from app.models.flashcard import FlashcardSet  # noqa: F401
from app.models.planner import StudyPlan  # noqa: F401
from app.models.profile import UserProfile  # noqa: F401
from app.models.user import User  # noqa: F401
