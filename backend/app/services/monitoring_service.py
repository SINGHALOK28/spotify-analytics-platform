from sqlalchemy.orm import Session
from app.models.system_metrics import SystemMetrics
import datetime
import logging

logger = logging.getLogger(__name__)

class MonitoringService:
    @staticmethod
    def increment_metric(db: Session, metric_name: str, increment_by: int = 1):
        """
        Increments a daily metric in the system_metrics table.
        Using a separate session block to ensure it doesn't interfere with main transaction.
        """
        try:
            today = datetime.date.today()
            metric = db.query(SystemMetrics).filter(
                SystemMetrics.metric_name == metric_name,
                SystemMetrics.date == today
            ).first()
            
            if metric:
                metric.metric_value += increment_by
            else:
                metric = SystemMetrics(metric_name=metric_name, metric_value=increment_by, date=today)
                db.add(metric)
                
            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to increment metric {metric_name}: {e}")
