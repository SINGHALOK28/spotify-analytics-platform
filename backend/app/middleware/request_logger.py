import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.database.session import SessionLocal
from app.services.monitoring_service import MonitoringService

logger = logging.getLogger("middleware.request_logger")

class RequestLoggerMiddleware(BaseHTTPMiddleware):
    """Middleware to log all incoming HTTP requests."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Increment metric
        try:
            db = SessionLocal()
            MonitoringService.increment_metric(db, "api_requests")
        finally:
            db.close()
            
        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000
            
            logger.info(
                f"{request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.2f}ms"
            )
            
            # Optionally add process time header
            response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
            return response
            
        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"{request.method} {request.url.path} - Status: 500 - Time: {process_time:.2f}ms - Error: {str(e)}"
            )
            raise e
