from fastapi import APIRouter, Depends
from sqlmodel import select
from app.models.user import User
from app.services.database import get_session

router = APIRouter()

@router.get('/match')
def match_users(interest: str, session=Depends(get_session)):
    # Example: match users by username containing interest
    statement = select(User).where(User.username.contains(interest))
    users = session.exec(statement).all()
    return users
