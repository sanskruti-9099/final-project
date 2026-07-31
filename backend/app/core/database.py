"""
SQLAlchemy engine, session factory, and dependency for FastAPI routes.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,       # verify connections before checkout
    pool_size=10,             # default pool size
    max_overflow=20,          # additional connections beyond pool_size
    pool_recycle=3600,        # recycle connections after 1 hour
    echo=settings.DEBUG,      # log SQL in debug mode
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a transactional database session.

    Usage:
        @router.get("/items")
        def list_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
