from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.track_service import TrackService
from app.services.monitoring_service import MonitoringService
from app.api.auth import get_current_user
from app.schemas.track_schemas import CustomRecommendationRequest
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/{track_id}")
def get_recommendations(track_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    logger.info(f"Seed track selected: {track_id}")
    logger.info(f"Recommendation request from user: {current_user.email}")
    MonitoringService.increment_metric(db, "total_recommendations")
    try:
        res = TrackService.get_recommendations(db, track_id)
        logger.info(f"Recommendation response count: {len(res) if res else 0}")
        return res
    except Exception as e:
        logger.error(f"Recommendation failures: {str(e)}")
        raise e

@router.post("/custom")
def get_custom_recommendations(req: CustomRecommendationRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    logger.info(f"Custom recommendation request from user: {current_user.email}")
    MonitoringService.increment_metric(db, "total_recommendations")
    target_features = [
        req.danceability, req.energy, req.speechiness,
        req.acousticness, req.instrumentalness, req.liveness,
        req.valence, req.tempo / 250.0
    ]
    try:
        res = TrackService.get_custom_recommendations(db, target_features, req.genre_filter)
        logger.info(f"Recommendation response count: {len(res) if res else 0}")
        return res
    except Exception as e:
        logger.error(f"Recommendation failures: {str(e)}")
        raise e
