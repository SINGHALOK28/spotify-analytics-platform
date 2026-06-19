from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.sql import text
import logging

from app.database.session import engine
from app.api import dashboard, genres, tracks, predictions, recommendations, auth, analytics, admin
from app.core.logging_config import setup_logging
from app.middleware.request_logger import RequestLoggerMiddleware

logger = setup_logging()

app = FastAPI(
    title="Spotify Analytics API v1.0",
    description="API for the Spotify Analytics Platform with ML Predictions",
    version="1.0.0"
)

app.add_middleware(RequestLoggerMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(genres.router, prefix="/api/genres", tags=["Genres"])
app.include_router(tracks.router, prefix="/api/tracks", tags=["Tracks"])
app.include_router(predictions.router, prefix="/api/predict", tags=["Predictions"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.on_event("startup")
def startup_event():
    logger.info("Verifying database connection...")
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("Database connection successful.")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise e
        
    logger.info("Loading ML models... (Mock loading successful)")
    # In a real scenario, you'd load your trained scikit-learn model here
    # e.g., app.state.model = joblib.load('path/to/model.pkl')

@app.get("/")
def root():
    return {"status": "healthy"}
