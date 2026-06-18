import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.artist import Artist
from app.models.genre import Genre
from app.models.track import Track
from app.models.etl_log import ETLLog
from sqlalchemy.dialects.postgresql import insert

def load_data(df: pd.DataFrame, start_time: datetime, row_count_extracted: int):
    db: Session = SessionLocal()
    status = "success"
    error_msg = None
    records_loaded = 0
    try:
        # 1. Load artists
        artist_names = df["artists"].dropna().unique()
        existing_artists = db.query(Artist.artist_name, Artist.id).filter(Artist.artist_name.in_(artist_names)).all()
        artist_map = {a.artist_name: a.id for a in existing_artists}
        
        new_artists = [{"artist_name": name, "artist_id": name} for name in artist_names if name not in artist_map]
        if new_artists:
            db.bulk_insert_mappings(Artist, new_artists)
            db.commit()
            existing_artists = db.query(Artist.artist_name, Artist.id).filter(Artist.artist_name.in_(artist_names)).all()
            artist_map = {a.artist_name: a.id for a in existing_artists}
            
        # 2. Load genres
        genre_names = df["track_genre"].dropna().unique()
        existing_genres = db.query(Genre.genre_name, Genre.id).filter(Genre.genre_name.in_(genre_names)).all()
        genre_map = {g.genre_name: g.id for g in existing_genres}
        
        new_genres = [{"genre_name": name} for name in genre_names if name not in genre_map]
        if new_genres:
            db.bulk_insert_mappings(Genre, new_genres)
            db.commit()
            existing_genres = db.query(Genre.genre_name, Genre.id).filter(Genre.genre_name.in_(genre_names)).all()
            genre_map = {g.genre_name: g.id for g in existing_genres}
            
        # 3. Load tracks
        track_records = []
        for _, row in df.iterrows():
            record = row.to_dict()
            record["artist_id"] = artist_map.get(record["artists"])
            record["genre_id"] = genre_map.get(record["track_genre"])
            
            # Remove keys that aren't in Track model
            record.pop("artists", None)
            record.pop("track_genre", None)
            record.pop("unnamed:_0", None)
            track_records.append(record)
            
        # Batch insert for performance
        BATCH_SIZE = 1000
        for i in range(0, len(track_records), BATCH_SIZE):
            batch = track_records[i:i + BATCH_SIZE]
            stmt = insert(Track).values(batch)
            update_dict = {c.name: c for c in stmt.excluded if not c.primary_key and c.name != 'track_id'}
            
            upsert_stmt = stmt.on_conflict_do_update(
                index_elements=['track_id'],
                set_=update_dict
            )
            db.execute(upsert_stmt)
            db.commit()
            records_loaded += len(batch)
            if records_loaded % 10000 == 0:
                print(f"Loaded {records_loaded} tracks...")
                
    except Exception as e:
        db.rollback()
        status = "failed"
        error_msg = str(e)
        raise e
    finally:
        end_time = datetime.utcnow()
        log = ETLLog(
            job_name="spotify_tracks_etl",
            status=status,
            records_processed=row_count_extracted,
            records_failed=row_count_extracted - records_loaded if status == "failed" else 0,
            start_time=start_time,
            end_time=end_time,
            error_message=error_msg
        )
        db.add(log)
        db.commit()
        db.close()
        
    return records_loaded
