from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.track_service import TrackService
from app.api.auth import get_current_user
from app.schemas.track_schemas import CustomRecommendationRequest

router = APIRouter()

@router.get("/{track_id}")
def get_recommendations(track_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return TrackService.get_recommendations(db, track_id)

@router.post("/custom")
def get_custom_recommendations(req: CustomRecommendationRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    target_features = [
        req.danceability, req.energy, req.speechiness,
        req.acousticness, req.instrumentalness, req.liveness,
        req.valence, req.tempo / 250.0
    ]
    return TrackService.get_custom_recommendations(db, target_features, req.genre_filter)
