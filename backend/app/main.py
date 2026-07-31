"""
FastAPI application factory.

Creates and configures the application instance:
  - Swagger / ReDoc metadata
  - CORS middleware
  - Exception handlers
  - Structured logging
  - API versioned router
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api.v1.router import router as v1_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import get_logger, setup_logging

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup / shutdown lifecycle."""
    # ── Startup ────────────────────────────────────────
    setup_logging()
    logger = get_logger(__name__)
    logger.info(
        "startup",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        debug=settings.DEBUG,
    )
    yield
    # ── Shutdown ───────────────────────────────────────
    logger.info("shutdown")


def create_app() -> FastAPI:
    """Build and return the configured FastAPI application."""

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=(
            "Backend API for the AI Study Assistant — powered by Groq."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # ── CORS ───────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Exception handlers ─────────────────────────────
    register_exception_handlers(app)

    # ── Routers ────────────────────────────────────────
    app.include_router(v1_router)

    # ── Static Files ───────────────────────────────────
    os.makedirs("uploads/profile", exist_ok=True)
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

    return app
