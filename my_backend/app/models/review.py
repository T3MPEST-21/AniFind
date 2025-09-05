from sqlmodel import SQLModel, Field
from datetime import datetime

class Review(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    anime_id: int = Field(index=True)
    rating: int # 1-5
    comment: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
