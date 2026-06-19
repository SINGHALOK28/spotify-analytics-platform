from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import JWTError, jwt

from app.database.session import get_db
from app.models.user import User
from app.schemas.auth_schemas import UserCreate, Token
from app.services.auth_service import AuthService, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from app.services.monitoring_service import MonitoringService
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            logger.warning("Invalid JWT token: sub claim missing")
            raise credentials_exception
    except JWTError as e:
        logger.warning(f"Invalid JWT token: {str(e)}")
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        logger.warning(f"Invalid JWT token: User {email} not found")
        raise credentials_exception
    return user


@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    AuthService.register_user(db, user)
    logger.info(f"User registered: {user.email}")
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        user = AuthService.authenticate_user(db, form_data.username, form_data.password)
        logger.info(f"User login successful: {form_data.username}")
        MonitoringService.increment_metric(db, "successful_logins")
    except HTTPException as e:
        logger.warning(f"Invalid login attempt for user: {form_data.username}")
        MonitoringService.increment_metric(db, "failed_logins")
        raise e
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
