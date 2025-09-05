from sqlmodel import SQLModel, Field
from datetime import datetime

class Notification(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int
    message: str
    read: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)
