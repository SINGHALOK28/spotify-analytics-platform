from sqlalchemy.orm import Session, contains_eager
from sqlalchemy import or_, desc, asc
from app.models.track import Track
from app.models.artist import Artist
from app.models.genre import Genre
from fastapi import HTTPException
import math
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class TrackService:
    @staticmethod
    def search_tracks(
        db: Session,
        q: str = None,
        genre: str = None,
        bucket: str = None,
        sort_by: str = None,
        sort_dir: str = "desc",
        page: int = 1,
        page_size: int = 20
    ):
        query = db.query(Track).outerjoin(Artist).outerjoin(Genre).options(contains_eager(Track.artist), contains_eager(Track.genre))

        if q:
            query = query.filter(
                or_(
                    Track.track_name.ilike(f"%{q}%"),
                    Artist.artist_name.ilike(f"%{q}%")
                )
            )
        if genre:
            query = query.filter(Genre.genre_name.ilike(f"%{genre}%"))
        if bucket:
            query = query.filter(Track.popularity_bucket == bucket)

        if sort_by in ["popularity", "tempo", "danceability"]:
            column = getattr(Track, sort_by)
            if sort_dir == "desc":
                query = query.order_by(desc(column))
            else:
                query = query.order_by(asc(column))
        else:
            query = query.order_by(desc(Track.popularity))

        total_count = query.count()
        total_pages = math.ceil(total_count / page_size) if total_count > 0 else 1
        
        offset = (page - 1) * page_size
        tracks = query.offset(offset).limit(page_size).all()

        result_tracks = []
        for t in tracks:
            d = {c.name: getattr(t, c.name) for c in t.__table__.columns}
            d["artists"] = t.artists
            d["track_genre"] = t.track_genre
            result_tracks.append(d)

        return {
            "tracks": result_tracks,
            "total_count": total_count,
            "page": page,
            "total_pages": total_pages
        }

    @staticmethod
    def get_recommendations(db: Session, track_id: str):
        target_track = db.query(Track).filter(Track.track_id == track_id).first()
        if not target_track:
            raise HTTPException(status_code=404, detail="Track not found")
            
        other_tracks = db.query(Track).filter(Track.track_id != track_id).limit(10000).all()
        if not other_tracks:
            return []

        def get_feature_vector(track):
            return [
                track.danceability, track.energy, track.speechiness,
                track.acousticness, track.instrumentalness, track.liveness,
                track.valence, track.tempo / 250.0
            ]

        target_vector = np.array([get_feature_vector(target_track)])
        other_vectors = np.array([get_feature_vector(t) for t in other_tracks])

        similarities = cosine_similarity(target_vector, other_vectors)[0]
        top_indices = np.argsort(similarities)[::-1][:10]

        recommendations = []
        for idx in top_indices:
            track = other_tracks[idx]
            sim_score = float(similarities[idx]) * 100 
            recommendations.append({
                "track_id": track.track_id,
                "track_name": track.track_name,
                "similarity_score": round(sim_score, 2),
                "popularity": track.popularity
            })

        return recommendations
