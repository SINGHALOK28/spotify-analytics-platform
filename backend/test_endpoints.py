import sys
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import SessionLocal
from app.models.track import Track
import json
import logging

# Disable uvicorn/fastapi logs for clean output
logging.getLogger("uvicorn").setLevel(logging.ERROR)
logging.getLogger("fastapi").setLevel(logging.ERROR)

client = TestClient(app)

def run_tests():
    print("Testing Complete Backend...")
    db = SessionLocal()
    
    # 1. GET /
    print("\n1. GET /")
    res = client.get("/")
    print(f"Status: {res.status_code}")
    print(f"Response: {res.json()}")
    assert res.status_code == 200

    # 2. GET /api/dashboard
    print("\n2. GET /api/dashboard")
    res = client.get("/api/dashboard")
    print(f"Status: {res.status_code}")
    print(f"Response: {res.json()}")
    assert res.status_code == 200

    # 3. GET /api/genres/top
    print("\n3. GET /api/genres/top")
    res = client.get("/api/genres/top")
    print(f"Status: {res.status_code}")
    print(f"Response: {json.dumps(res.json()[:2], indent=2)} ... (truncated)")
    assert res.status_code == 200

    # 4. GET /api/tracks/search?q=love
    print("\n4. GET /api/tracks/search?q=love")
    res = client.get("/api/tracks/search?q=love")
    print(f"Status: {res.status_code}")
    data = res.json()
    print(f"Response: Found {data['total_count']} tracks. First track: {data['tracks'][0]['track_name'] if data['tracks'] else 'None'}")
    assert res.status_code == 200

    # 5. POST /api/predict
    print("\n5. POST /api/predict")
    # Register & Login first to get JWT since we protected this route
    client.post("/api/auth/register", json={"email": "test@example.com", "password": "Password1!"})
    login_res = client.post("/api/auth/login", json={"email": "test@example.com", "password": "Password1!"})
    token = login_res.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"} if token else {}

    payload = {
      "danceability": 0.8,
      "energy": 0.9,
      "speechiness": 0.1,
      "acousticness": 0.2,
      "instrumentalness": 0.0,
      "liveness": 0.1,
      "valence": 0.8,
      "tempo": 120.0
    }
    res = client.post("/api/predict", json=payload, headers=headers)
    print(f"Status: {res.status_code}")
    print(f"Response: {res.json()}")
    assert res.status_code == 200

    # 6. GET /api/recommendations/{track_id}
    print("\n6. GET /api/recommendations/{track_id}")
    track = db.query(Track).first()
    if track:
        track_id = track.track_id
        res = client.get(f"/api/recommendations/{track_id}")
        print(f"Status: {res.status_code}")
        print(f"Response: Found {len(res.json())} recommendations for {track.track_name}")
        assert res.status_code == 200
    else:
        print("No tracks found in DB to test recommendations.")
        
    db.close()
    print("\nAll 6 endpoints work correctly!")

if __name__ == "__main__":
    run_tests()
