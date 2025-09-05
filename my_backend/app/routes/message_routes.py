from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from app.models.message import Message
from app.services.database import get_session

router = APIRouter()

@router.post('/send')
def send_message(sender_id: int, receiver_id: int, content: str, session=Depends(get_session)):
    msg = Message(sender_id=sender_id, receiver_id=receiver_id, content=content)
    session.add(msg)
    session.commit()
    session.refresh(msg)
    return msg

@router.get('/inbox/{user_id}')
def get_inbox(user_id: int, session=Depends(get_session)):
    messages = session.exec(select(Message).where(Message.receiver_id == user_id)).all()
    return messages

@router.get('/sent/{user_id}')
def get_sent(user_id: int, session=Depends(get_session)):
    messages = session.exec(select(Message).where(Message.sender_id == user_id)).all()
    return messages
