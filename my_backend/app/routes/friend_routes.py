from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from app.models.friend import FriendRequest
from app.services.database import get_session

router = APIRouter()

@router.post('/send_request')
def send_friend_request(sender_id: int, receiver_id: int, session=Depends(get_session)):
    request = FriendRequest(sender_id=sender_id, receiver_id=receiver_id, status='pending')
    session.add(request)
    session.commit()
    session.refresh(request)
    return request

@router.post('/respond_request')
def respond_friend_request(request_id: int, status: str, session=Depends(get_session)):
    request = session.get(FriendRequest, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    request.status = status
    session.add(request)
    session.commit()
    session.refresh(request)
    return request

@router.get('/list_friends/{user_id}')
def list_friends(user_id: int, session=Depends(get_session)):
    sent = session.exec(select(FriendRequest).where(FriendRequest.sender_id == user_id, FriendRequest.status == 'accepted')).all()
    received = session.exec(select(FriendRequest).where(FriendRequest.receiver_id == user_id, FriendRequest.status == 'accepted')).all()
    return sent + received
