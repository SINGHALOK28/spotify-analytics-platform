from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.track_service import TrackService
from typing import Optional

router = APIRouter()

@router.get("/search")
def search_tracks(
    q: Optional[str] = None,
    genre: Optional[str] = None,
    bucket: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_dir: Optional[str] = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return TrackService.search_tracks(db, q, genre, bucket, sort_by, sort_dir, page, page_size)
