from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base


class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    track_id = Column(String, unique=True, index=True)
    track_name = Column(String, index=True)
    album_name = Column(String)
    popularity = Column(Integer)
    duration_ms = Column(Integer)
    explicit = Column(Boolean)
    danceability = Column(Float)
    energy = Column(Float)
    key = Column(Integer)
    loudness = Column(Float)
    mode = Column(Integer)
    speechiness = Column(Float)
    acousticness = Column(Float)
    instrumentalness = Column(Float)
    liveness = Column(Float)
    valence = Column(Float)
    tempo = Column(Float)
    time_signature = Column(Integer)
    duration_minutes = Column(Float)
    energy_level = Column(String)
    danceability_level = Column(String)
    tempo_category = Column(String)
    popularity_bucket = Column(String)

    artist_id = Column(Integer, ForeignKey("artists.id"))
    genre_id = Column(Integer, ForeignKey("genres.id"))

    artist = relationship("Artist", back_populates="tracks")
    genre = relationship("Genre", back_populates="tracks")

    @property
    def artists(self):
        return self.artist.artist_name if self.artist else "Unknown"

    @property
    def track_genre(self):
        return self.genre.genre_name if self.genre else "Unknown"
