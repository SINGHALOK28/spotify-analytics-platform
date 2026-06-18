from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.prediction_schemas import PredictionInput, PredictionOutput
from app.services.prediction_service import PredictionService
from app.api.auth import get_current_user

router = APIRouter()

@router.post("", response_model=PredictionOutput)
def predict(
    features: PredictionInput,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    predicted_pop, category = PredictionService.create_prediction(db, features)
    
    return PredictionOutput(
        predicted_popularity=predicted_pop,
        category=category
    )
