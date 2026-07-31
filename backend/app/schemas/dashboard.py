from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class DashboardStatistics(BaseModel):
    questions_asked: int = Field(default=0, description="Total AI chat questions asked")
    summaries_created: int = Field(default=0, description="Total notes summarized")
    quizzes_generated: int = Field(default=0, description="Total quizzes generated")
    flashcards_created: int = Field(default=0, description="Total flashcard sets generated")
    study_plans_created: int = Field(default=0, description="Total study plans created")


class RecentActivityItem(BaseModel):
    id: int
    feature: str = Field(description="Name of the feature, e.g., 'AI Chat', 'Quiz Generator'")
    title: str = Field(description="Title or preview of the activity")
    created_at: datetime
    status: str = Field(default="completed", description="Status of the activity")


class TodayGoal(BaseModel):
    completed: int = Field(default=0)
    total: int = Field(default=0)
    progress: int = Field(default=0, description="Percentage of progress from 0 to 100")


class DashboardResponse(BaseModel):
    success: bool = True
    statistics: DashboardStatistics
    recent_activity: List[RecentActivityItem]
    today_goal: TodayGoal
