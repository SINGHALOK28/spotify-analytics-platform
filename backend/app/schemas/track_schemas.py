from pydantic import BaseModel
from typing import Optional

class TrackResponse(BaseModel):
    id: int
    track_id: str
    album_name: Optional[str] = None
    track_name: str
    popularity: int
    duration_ms: int
    explicit: bool
    danceability: float
    energy: float
    key: int
    loudness: float
    mode: int
    speechiness: float
    acousticness: float
    instrumentalness: float
    liveness: float
    valence: float
    tempo: float
    time_signature: int
    artist_id: Optional[int] = None
    genre_id: Optional[int] = None
    
    # Virtual properties from relationship
    artists: Optional[str] = None
    track_genre: Optional[str] = None
    
    # Engineered columns
    duration_minutes: Optional[float] = None
    energy_level: Optional[str] = None
    danceability_level: Optional[str] = None
    tempo_category: Optional[str] = None
    popularity_bucket: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True

class TrackSearchParams(BaseModel):
    q: Optional[str] = None
    genre: Optional[str] = None
    bucket: Optional[str] = None
    sort_by: Optional[str] = None
    sort_dir: Optional[str] = "desc"
    page: int = 1
    page_size: int = 20
