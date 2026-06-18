from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.track_service import TrackService
from app.api.auth import get_current_user

router = APIRouter()

@router.get("/{track_id}")
def get_recommendations(track_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return TrackService.get_recommendations(db, track_id)
