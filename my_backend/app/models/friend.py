from sqlmodel import SQLModel, Field

class FriendRequest(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    sender_id: int = Field(index=True)
    receiver_id: int = Field(index=True)
    status: str # 'pending', 'accepted', 'rejected'
