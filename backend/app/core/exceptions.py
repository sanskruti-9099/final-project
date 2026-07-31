"""
Application-wide custom exceptions and FastAPI exception handlers.
"""

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

logger = get_logger(__name__)


# ── Custom Exception Classes ──────────────────────────────


class AppException(Exception):
    """Base exception for the AI Study Assistant."""

    def __init__(
        self,
        message: str = "An unexpected error occurred.",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
    ) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundException(AppException):
    """Raised when a requested resource does not exist."""

    def __init__(self, message: str = "Resource not found.") -> None:
        super().__init__(message=message, status_code=status.HTTP_404_NOT_FOUND)


class BadRequestException(AppException):
    """Raised for malformed or invalid client requests."""

    def __init__(self, message: str = "Bad request.") -> None:
        super().__init__(message=message, status_code=status.HTTP_400_BAD_REQUEST)


class UnauthorizedException(AppException):
    """Raised when authentication is required but missing or invalid."""

    def __init__(self, message: str = "Unauthorized.") -> None:
        super().__init__(message=message, status_code=status.HTTP_401_UNAUTHORIZED)


class ForbiddenException(AppException):
    """Raised when the user lacks permission for the requested action."""

    def __init__(self, message: str = "Forbidden.") -> None:
        super().__init__(message=message, status_code=status.HTTP_403_FORBIDDEN)


# ── Exception Handlers ────────────────────────────────────


def _error_response(status_code: int, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
        },
    )


async def app_exception_handler(_request: Request, exc: AppException) -> JSONResponse:
    """Handle all custom AppException subclasses."""
    logger.warning("app_exception", message=exc.message, status_code=exc.status_code)
    return _error_response(exc.status_code, exc.message)


async def generic_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
    """Catch-all for unhandled exceptions — returns a 500."""
    logger.exception("unhandled_exception", error=str(exc))
    return _error_response(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "An internal server error occurred.",
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Attach all exception handlers to the FastAPI application."""
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
