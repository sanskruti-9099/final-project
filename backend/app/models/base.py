"""
SQLAlchemy declarative base with common columns.

Every future model should inherit from ``Base``.
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """
    Abstract declarative base shared by all ORM models.

    Provides:
      - ``id``           — auto-increment primary key
      - ``created_at``   — timestamp set on insert (UTC)
      - ``updated_at``   — timestamp set on insert and updated on every flush (UTC)
    """

    __abstract__ = True

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
