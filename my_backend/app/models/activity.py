from sqlmodel import SQLModel, Field
from datetime import datetime

class Activity(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int
    type: str # e.g. 'review', 'match', 'message', 'friend'
    detail: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
