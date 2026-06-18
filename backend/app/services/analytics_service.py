from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from app.models.track import Track
from app.models.artist import Artist
from app.models.genre import Genre

class AnalyticsService:
    @staticmethod
    def get_dashboard_stats(db: Session):
        total_tracks = db.query(func.count(Track.id)).scalar() or 0
        total_artists = db.query(func.count(Artist.id)).scalar() or 0
        total_genres = db.query(func.count(Genre.id)).scalar() or 0
        avg_popularity = db.query(func.avg(Track.popularity)).scalar() or 0.0
        
        return {
            "total_tracks": total_tracks,
            "total_artists": total_artists,
            "total_genres": total_genres,
            "avg_popularity": avg_popularity
        }

    @staticmethod
    def get_top_genres(db: Session, limit: int = 10):
        results = db.query(
            Genre.genre_name, 
            func.count(Track.id).label('track_count')
        ).join(Track, Genre.id == Track.genre_id)\
         .group_by(Genre.genre_name)\
         .order_by(desc('track_count'))\
         .limit(limit)\
         .all()

        return [{"genre_name": row[0], "track_count": row[1]} for row in results]

    @staticmethod
    def get_popularity_distribution(db: Session):
        results = db.query(
            Track.popularity_bucket, 
            func.count(Track.id).label("count")
        ).group_by(Track.popularity_bucket).all()

        return [{"bucket": r.popularity_bucket, "count": r.count} for r in results if r.popularity_bucket]

    @staticmethod
    def get_feature_trends(db: Session):
        top_genres_query = db.query(
            Genre.id, Genre.genre_name
        ).join(Track, Genre.id == Track.genre_id)\
         .group_by(Genre.id, Genre.genre_name)\
         .order_by(desc(func.count(Track.id)))\
         .limit(10).all()

        top_genre_ids = [g.id for g in top_genres_query]
        genre_names = {g.id: g.genre_name for g in top_genres_query}

        averages = db.query(
            Track.genre_id,
            func.avg(Track.danceability).label("avg_danceability"),
            func.avg(Track.energy).label("avg_energy"),
            func.avg(Track.speechiness).label("avg_speechiness"),
            func.avg(Track.acousticness).label("avg_acousticness"),
            func.avg(Track.instrumentalness).label("avg_instrumentalness"),
            func.avg(Track.liveness).label("avg_liveness"),
            func.avg(Track.valence).label("avg_valence")
        ).filter(Track.genre_id.in_(top_genre_ids))\
         .group_by(Track.genre_id).all()

        formatted_data = []
        for row in averages:
            formatted_data.append({
                "genre": genre_names[row.genre_id],
                "danceability": float(row.avg_danceability),
                "energy": float(row.avg_energy),
                "speechiness": float(row.avg_speechiness),
                "acousticness": float(row.avg_acousticness),
                "instrumentalness": float(row.avg_instrumentalness),
                "liveness": float(row.avg_liveness),
                "valence": float(row.avg_valence)
            })

        return formatted_data

    @staticmethod
    def get_top_tracks(db: Session):
        tracks = db.query(Track).options(joinedload(Track.artist), joinedload(Track.genre)).order_by(desc(Track.popularity)).limit(20).all()
        result = []
        for t in tracks:
            d = {c.name: getattr(t, c.name) for c in t.__table__.columns}
            d["artists"] = t.artists
            d["track_genre"] = t.track_genre
            result.append(d)
        return result
