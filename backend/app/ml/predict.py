from app.schemas.prediction_schemas import PredictionInput

def predict_popularity(features: PredictionInput) -> int:
    # A simple mock logic to return a popularity score 0-100
    # based roughly on high danceability and energy
    base_score = 30
    dance_bonus = int(features.danceability * 30)
    energy_bonus = int(features.energy * 20)
    
    score = base_score + dance_bonus + energy_bonus
    return min(100, max(0, score))
