"""
Aggregate router for API version 1.

Import and include all feature routers here.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import chat, health, summary, quiz, flashcards, planner, dashboard, profile, auth

router = APIRouter(prefix="/api/v1")

# ── Feature routers ───────────────────────────────────
router.include_router(health.router, tags=["Health"])
router.include_router(auth.router, prefix="/auth", tags=["Auth"])
router.include_router(chat.router, tags=["Chat"])
router.include_router(summary.router, tags=["Summary"])
router.include_router(quiz.router, tags=["Quiz"])
router.include_router(flashcards.router, tags=["Flashcards"])
router.include_router(planner.router, tags=["Study Planner"])
router.include_router(dashboard.router, tags=["Dashboard"])
router.include_router(profile.router, tags=["Profile"])
