from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.prediction_schemas import PredictionInput, PredictionOutput
from app.services.prediction_service import PredictionService
from app.services.monitoring_service import MonitoringService
from app.api.auth import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("", response_model=PredictionOutput)
def predict(
    features: PredictionInput,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    logger.info(f"Prediction request received for user {current_user.email}")
    MonitoringService.increment_metric(db, "total_predictions")
    try:
        predicted_pop, category = PredictionService.create_prediction(db, features)
        logger.info(f"Prediction generated - Score: {predicted_pop:.2f}, Category: {category}")
        
        return PredictionOutput(
            predicted_popularity=predicted_pop,
            category=category
        )
    except Exception as e:
        logger.error(f"Prediction failures: {str(e)}")
        raise e
