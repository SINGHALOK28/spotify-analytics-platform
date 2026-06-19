from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.system_metrics import SystemMetrics
from app.models.etl_log import ETLLog
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/system-metrics")
def get_system_metrics(db: Session = Depends(get_db)):
    metrics = db.query(
        SystemMetrics.metric_name, 
        func.sum(SystemMetrics.metric_value).label("total")
    ).group_by(SystemMetrics.metric_name).all()
    
    # Default values as expected by frontend
    result = {
        "api_requests": 0,
        "predictions": 0,
        "recommendations": 0,
        "successful_logins": 0,
        "failed_logins": 0,
        "etl_runs": 0
    }
    
    for metric_name, total in metrics:
        if metric_name in result:
            result[metric_name] = int(total) if total else 0
            
    # As a fallback if the table is empty or just created, let's query ETLLog count
    if result["etl_runs"] == 0:
        result["etl_runs"] = db.query(func.count(ETLLog.id)).scalar() or 0
            
    return result

@router.get("/etl-status")
def get_etl_status(db: Session = Depends(get_db)):
    # Return latest ETL run statistics
    latest_run = db.query(ETLLog).order_by(ETLLog.id.desc()).first()
    if not latest_run:
        return {}
    
    duration = 0
    if latest_run.end_time and latest_run.start_time:
        duration = int((latest_run.end_time - latest_run.start_time).total_seconds())
        
    return {
        "run_timestamp": latest_run.start_time,
        "rows_processed": latest_run.records_processed,
        "status": latest_run.status,
        "duration_seconds": duration,
        "error_message": latest_run.error_message
    }
