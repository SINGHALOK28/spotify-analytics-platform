from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from app.database.base import Base


class ETLLog(Base):
    __tablename__ = "etl_logs"

    id = Column(Integer, primary_key=True, index=True)
    job_name = Column(String, index=True)
    status = Column(String)
    records_processed = Column(Integer)
    records_failed = Column(Integer)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime)
    error_message = Column(String, nullable=True)
