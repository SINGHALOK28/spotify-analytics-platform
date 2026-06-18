import urllib.request
import urllib.parse
import json

def test_api():
    base_url = "http://localhost:8000"
    print("Testing live API at:", base_url)
    
    # 1. GET /
    print("\n1. GET /")
    req = urllib.request.urlopen(f"{base_url}/")
    data = json.loads(req.read().decode())
    print("Response:", data)
    assert data["status"] == "healthy"

    # 2. GET /api/dashboard
    print("\n2. GET /api/dashboard")
    req = urllib.request.urlopen(f"{base_url}/api/dashboard")
    data = json.loads(req.read().decode())
    print("Response dashboard keys:", list(data.keys()))
    print("Values:", data)
    
    # 3. GET /api/genres/top
    print("\n3. GET /api/genres/top")
    req = urllib.request.urlopen(f"{base_url}/api/genres/top")
    data = json.loads(req.read().decode())
    print(f"Response (top 2): {data[:2]}")

    # 4. GET /api/tracks/search?q=love
    print("\n4. GET /api/tracks/search?q=love")
    req = urllib.request.urlopen(f"{base_url}/api/tracks/search?q=love")
    data = json.loads(req.read().decode())
    print(f"Response: Found {data['total_count']} tracks. First track: {data['tracks'][0]['track_name'] if data['tracks'] else 'None'}")
    first_track_id = data['tracks'][0]['track_id'] if data['tracks'] else None

    # 5. POST /api/auth/register
    print("\n5. POST /api/auth/register")
    reg_data = json.dumps({"email": "test_live@example.com", "password": "Password1!"}).encode()
    req = urllib.request.Request(
        f"{base_url}/api/auth/register", 
        data=reg_data, 
        headers={"Content-Type": "application/json"}
    )
    try:
        urllib.request.urlopen(req)
        print("Registration: Success (or user already exists)")
    except Exception as e:
        print("Registration error (may already exist):", e)

    # 6. POST /api/auth/login
    print("\n6. POST /api/auth/login")
    login_payload = urllib.parse.urlencode({"username": "test_live@example.com", "password": "Password1!"}).encode()
    req = urllib.request.Request(
        f"{base_url}/api/auth/login",
        data=login_payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    res = urllib.request.urlopen(req)
    auth_data = json.loads(res.read().decode())
    token = auth_data["access_token"]
    print("Login successful, token retrieved.")

    # 7. POST /api/predict
    print("\n7. POST /api/predict")
    predict_payload = json.dumps({
      "danceability": 0.8,
      "energy": 0.9,
      "speechiness": 0.1,
      "acousticness": 0.2,
      "instrumentalness": 0.0,
      "liveness": 0.1,
      "valence": 0.8,
      "tempo": 120.0
    }).encode()
    req = urllib.request.Request(
        f"{base_url}/api/predict",
        data=predict_payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    res = urllib.request.urlopen(req)
    prediction = json.loads(res.read().decode())
    print("Prediction Response:", prediction)

    # 8. GET /api/recommendations/{track_id}
    if first_track_id:
        print(f"\n8. GET /api/recommendations/{first_track_id}")
        req = urllib.request.Request(
            f"{base_url}/api/recommendations/{first_track_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        res = urllib.request.urlopen(req)
        recs = json.loads(res.read().decode())
        print(f"Recommendations count: {len(recs)}")
        if recs:
            print("First recommendation:", recs[0]["track_name"])

if __name__ == "__main__":
    test_api()
