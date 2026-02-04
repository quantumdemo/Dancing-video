from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON
from datetime import datetime
from database import Base

class Generation(Base):
    __tablename__ = "generations"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(String, unique=True, index=True)
    type = Column(String)  # 'video' or 'avatar'
    prompt = Column(String)
    style = Column(String, nullable=True)
    output_urls = Column(JSON)  # List of URLs
    created_at = Column(DateTime, default=datetime.utcnow)
