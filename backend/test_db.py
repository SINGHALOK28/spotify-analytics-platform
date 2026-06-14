from sqlalchemy import text
from app.database.session import get_db

def test_connection():
    try:
        # get_db is a generator, so we use next() to get the session object
        db = next(get_db())
        result = db.execute(text("SELECT 1")).scalar()
        print(f"Connection successful! SELECT 1 returned: {result}")
    except Exception as e:
        print(f"Connection failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_connection()
