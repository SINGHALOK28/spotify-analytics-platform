from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database.base import Base


class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    genre_name = Column(String, unique=True, index=True)

    tracks = relationship("Track", back_populates="genre")
