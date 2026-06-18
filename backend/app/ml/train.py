from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.track import Track
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import joblib
import pandas as pd
import os

def train_model():
    print("Starting model training...")
    db: Session = SessionLocal()
    
    # Query all tracks to train the model
    tracks = db.query(Track).filter(Track.popularity.isnot(None)).all()
    if not tracks:
        print("No tracks available for training.")
        db.close()
        return

    data = []
    for t in tracks:
        data.append({
            "danceability": t.danceability,
            "energy": t.energy,
            "speechiness": t.speechiness,
            "acousticness": t.acousticness,
            "instrumentalness": t.instrumentalness,
            "liveness": t.liveness,
            "valence": t.valence,
            "tempo": t.tempo,
            "popularity": t.popularity
        })
    db.close()

    df = pd.DataFrame(data).dropna()
    if df.empty:
        print("Not enough clean data to train.")
        return

    X = df[['danceability', 'energy', 'speechiness', 'acousticness', 
            'instrumentalness', 'liveness', 'valence', 'tempo']]
    y = df['popularity']

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = LinearRegression()
    model.fit(X_scaled, y)

    # Save to disk
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, 'model.pkl')
    scaler_path = os.path.join(current_dir, 'scaler.pkl')

    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"Model and scaler saved to {current_dir}")

if __name__ == "__main__":
    train_model()
