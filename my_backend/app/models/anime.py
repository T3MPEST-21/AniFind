from sqlmodel import SQLModel, Field

class Anime(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str
    genre: str = Field(index=True)
