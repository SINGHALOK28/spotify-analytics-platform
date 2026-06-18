from sqlalchemy import text
from app.database.session import get_db

def check_counts():
    try:
        db = next(get_db())
        tracks_count = db.execute(text("SELECT COUNT(*) FROM tracks")).scalar()
        artists_count = db.execute(text("SELECT COUNT(*) FROM artists")).scalar()
        genres_count = db.execute(text("SELECT COUNT(*) FROM genres")).scalar()
        etl_count = db.execute(text("SELECT COUNT(*) FROM etl_logs")).scalar()
        
        print("Database Row Counts:")
        print(f"Tracks: {tracks_count}")
        print(f"Artists: {artists_count}")
        print(f"Genres: {genres_count}")
        print(f"ETL Logs: {etl_count}")
        
    except Exception as e:
        print(f"Error checking counts: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_counts()
