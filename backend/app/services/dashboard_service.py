from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import Depends
from app.core.database import get_db

from app.models.chat import ChatMessage
from app.models.summary import NoteSummary
from app.models.quiz import Quiz
from app.models.flashcard import FlashcardSet
from app.models.planner import StudyPlan
from app.schemas.dashboard import (
    DashboardResponse,
    DashboardStatistics,
    RecentActivityItem,
    TodayGoal
)
from app.core.logging import get_logger

logger = get_logger(__name__)


class DashboardService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_data(self) -> DashboardResponse:
        logger.info("Fetching dashboard data")
        
        # 1. Gather Statistics
        stats = DashboardStatistics(
            questions_asked=self.db.query(func.count(ChatMessage.id)).scalar() or 0,
            summaries_created=self.db.query(func.count(NoteSummary.id)).scalar() or 0,
            quizzes_generated=self.db.query(func.count(Quiz.id)).scalar() or 0,
            flashcards_created=self.db.query(func.count(FlashcardSet.id)).scalar() or 0,
            study_plans_created=self.db.query(func.count(StudyPlan.id)).scalar() or 0,
        )

        # 2. Gather Recent Activities
        activities: List[RecentActivityItem] = []

        # Fetch latest chats
        chats = self.db.query(ChatMessage).order_by(ChatMessage.created_at.desc()).limit(10).all()
        for chat in chats:
            # truncate question for title
            title = chat.question[:50] + "..." if len(chat.question) > 50 else chat.question
            activities.append(
                RecentActivityItem(
                    id=chat.id,
                    feature="AI Chat",
                    title=title,
                    created_at=chat.created_at,
                    status="completed"
                )
            )

        # Fetch latest summaries
        summaries = self.db.query(NoteSummary).order_by(NoteSummary.created_at.desc()).limit(10).all()
        for summary in summaries:
            title = summary.original_text[:50] + "..." if len(summary.original_text) > 50 else summary.original_text
            activities.append(
                RecentActivityItem(
                    id=summary.id,
                    feature="Summarizer",
                    title=title,
                    created_at=summary.created_at,
                    status="completed"
                )
            )

        # Fetch latest quizzes
        quizzes = self.db.query(Quiz).order_by(Quiz.created_at.desc()).limit(10).all()
        for quiz in quizzes:
            activities.append(
                RecentActivityItem(
                    id=quiz.id,
                    feature="Quiz Generator",
                    title=f"Quiz on {quiz.topic}",
                    created_at=quiz.created_at,
                    status="completed"
                )
            )

        # Fetch latest flashcards
        flashcards = self.db.query(FlashcardSet).order_by(FlashcardSet.created_at.desc()).limit(10).all()
        for fc in flashcards:
            activities.append(
                RecentActivityItem(
                    id=fc.id,
                    feature="Flashcards",
                    title=f"Cards on {fc.topic}",
                    created_at=fc.created_at,
                    status="completed"
                )
            )

        # Fetch latest plans
        plans = self.db.query(StudyPlan).order_by(StudyPlan.created_at.desc()).limit(10).all()
        for plan in plans:
            # subjects is stored as JSON array, e.g., ["Math", "Physics"]
            subs = ", ".join(plan.subjects[:2])
            title = f"Plan for {subs}" + ("..." if len(plan.subjects) > 2 else "")
            activities.append(
                RecentActivityItem(
                    id=plan.id,
                    feature="Study Planner",
                    title=title,
                    created_at=plan.created_at,
                    status="completed"
                )
            )

        # Sort combined activities by created_at descending and take top 10
        activities.sort(key=lambda x: x.created_at, reverse=True)
        recent_activity = activities[:10]

        # 3. Dummy Today's Goal
        today_goal = TodayGoal(
            completed=4,
            total=8,
            progress=50
        )

        return DashboardResponse(
            success=True,
            statistics=stats,
            recent_activity=recent_activity,
            today_goal=today_goal
        )

    def get_all_history(self, limit: int = 100) -> List[RecentActivityItem]:
        logger.info("Fetching all history data")
        activities: List[RecentActivityItem] = []

        # Fetch latest chats
        chats = self.db.query(ChatMessage).order_by(ChatMessage.created_at.desc()).limit(limit).all()
        for chat in chats:
            title = chat.question[:50] + "..." if len(chat.question) > 50 else chat.question
            activities.append(
                RecentActivityItem(
                    id=chat.id,
                    feature="AI Chat",
                    title=title,
                    created_at=chat.created_at,
                    status="completed"
                )
            )

        # Fetch latest summaries
        summaries = self.db.query(NoteSummary).order_by(NoteSummary.created_at.desc()).limit(limit).all()
        for summary in summaries:
            title = summary.original_text[:50] + "..." if len(summary.original_text) > 50 else summary.original_text
            activities.append(
                RecentActivityItem(
                    id=summary.id,
                    feature="Summarizer",
                    title=title,
                    created_at=summary.created_at,
                    status="completed"
                )
            )

        # Fetch latest quizzes
        quizzes = self.db.query(Quiz).order_by(Quiz.created_at.desc()).limit(limit).all()
        for quiz in quizzes:
            activities.append(
                RecentActivityItem(
                    id=quiz.id,
                    feature="Quiz Generator",
                    title=f"Quiz on {quiz.topic}",
                    created_at=quiz.created_at,
                    status="completed"
                )
            )

        # Fetch latest flashcards
        flashcards = self.db.query(FlashcardSet).order_by(FlashcardSet.created_at.desc()).limit(limit).all()
        for fc in flashcards:
            activities.append(
                RecentActivityItem(
                    id=fc.id,
                    feature="Flashcards",
                    title=f"Cards on {fc.topic}",
                    created_at=fc.created_at,
                    status="completed"
                )
            )

        # Fetch latest plans
        plans = self.db.query(StudyPlan).order_by(StudyPlan.created_at.desc()).limit(limit).all()
        for plan in plans:
            subs = ", ".join(plan.subjects[:2]) if hasattr(plan, 'subjects') and plan.subjects else "Unknown"
            title = f"Plan for {subs}" + ("..." if hasattr(plan, 'subjects') and plan.subjects and len(plan.subjects) > 2 else "")
            activities.append(
                RecentActivityItem(
                    id=plan.id,
                    feature="Study Planner",
                    title=title,
                    created_at=plan.created_at,
                    status="completed"
                )
            )

        activities.sort(key=lambda x: x.created_at, reverse=True)
        return activities[:limit]


def get_dashboard_service(db: Session = Depends(get_db)) -> DashboardService:
    return DashboardService(db)
