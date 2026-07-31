"""
Uvicorn entrypoint.

Run with:
    python run.py
or:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

import uvicorn

from app.main import create_app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "run:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
