from fastapi import APIRouter, Depends
from sqlmodel import select
from app.models.notification import Notification
from app.services.database import get_session

router = APIRouter()

@router.post('/send')
def send_notification(user_id: int, message: str, session=Depends(get_session)):
    notif = Notification(user_id=user_id, message=message)
    session.add(notif)
    session.commit()
    session.refresh(notif)
    return notif

@router.get('/list/{user_id}')
def list_notifications(user_id: int, session=Depends(get_session)):
    notifs = session.exec(select(Notification).where(Notification.user_id == user_id)).all()
    return notifs

@router.post('/mark_read/{notif_id}')
def mark_notification_read(notif_id: int, session=Depends(get_session)):
    notif = session.get(Notification, notif_id)
    if notif:
        notif.read = True
        session.add(notif)
        session.commit()
        session.refresh(notif)
    return notif
