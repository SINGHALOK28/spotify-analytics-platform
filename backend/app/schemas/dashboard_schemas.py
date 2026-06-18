from pydantic import BaseModel

class DashboardStats(BaseModel):
    total_tracks: int
    total_artists: int
    total_genres: int
    avg_popularity: float
