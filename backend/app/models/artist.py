from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database.base import Base


class Artist(Base):
    __tablename__ = "artists"

    id = Column(Integer, primary_key=True, index=True)
    artist_name = Column(String, index=True)
    artist_id = Column(String, unique=True, index=True)

    tracks = relationship("Track", back_populates="artist")
