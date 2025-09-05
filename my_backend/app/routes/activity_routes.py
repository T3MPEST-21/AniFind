from fastapi import APIRouter, Depends
from sqlmodel import select
from app.models.activity import Activity
from app.services.database import get_session

router = APIRouter()

@router.post('/add')
def add_activity(user_id: int, type: str, detail: str, session=Depends(get_session)):
    activity = Activity(user_id=user_id, type=type, detail=detail)
    session.add(activity)
    session.commit()
    session.refresh(activity)
    return activity

@router.get('/feed/{user_id}')
def get_activity_feed(user_id: int, session=Depends(get_session)):
    activities = session.exec(select(Activity).where(Activity.user_id == user_id)).all()
    return activities
