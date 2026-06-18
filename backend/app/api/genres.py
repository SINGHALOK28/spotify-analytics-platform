from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter()

@router.get("/top")
def get_top_genres(limit: int = Query(10, ge=1, le=100), db: Session = Depends(get_db)):
    return AnalyticsService.get_top_genres(db, limit)
