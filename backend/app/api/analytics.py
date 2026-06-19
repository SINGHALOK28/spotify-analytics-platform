from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter()

@router.get("/popularity-distribution")
def get_popularity_distribution(db: Session = Depends(get_db)):
    return AnalyticsService.get_popularity_distribution(db)

@router.get("/feature-trends")
def get_feature_trends(db: Session = Depends(get_db)):
    return AnalyticsService.get_feature_trends(db)

@router.get("/top-tracks")
def get_top_tracks(db: Session = Depends(get_db)):
    return AnalyticsService.get_top_tracks(db)

@router.get("/top-tracks-by-genre")
def get_top_tracks_by_genre(db: Session = Depends(get_db)):
    return AnalyticsService.get_top_tracks_by_genre(db)
