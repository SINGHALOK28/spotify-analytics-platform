from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.dashboard_schemas import DashboardStats
from app.services.analytics_service import AnalyticsService

router = APIRouter()

@router.get("", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    stats = AnalyticsService.get_dashboard_stats(db)
    return DashboardStats(**stats)
