from sqlalchemy.orm import Session
from app.schemas.prediction_schemas import PredictionInput
from app.ml.predict import predict_popularity
from app.models.model_prediction import ModelPrediction

class PredictionService:
    @staticmethod
    def get_category(pop: int) -> str:
        if pop <= 30: return "Low"
        elif pop <= 60: return "Medium"
        elif pop <= 80: return "Popular"
        else: return "Hit"

    @staticmethod
    def create_prediction(db: Session, features: PredictionInput):
        predicted_pop = predict_popularity(features)
        category = PredictionService.get_category(predicted_pop)

        prediction_record = ModelPrediction(
            model_name="popularity_predictor_mock",
            prediction_value=float(predicted_pop),
            confidence_score=1.0 # mock
        )
        db.add(prediction_record)
        db.commit()

        return predicted_pop, category
