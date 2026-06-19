from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.sql import func
from app.database.base import Base
import datetime

class SystemMetrics(Base):
    __tablename__ = "system_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String, index=True)
    metric_value = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    date = Column(Date, default=datetime.date.today, index=True)
