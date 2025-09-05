from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from app.models.watchlist import Watchlist
from app.services.database import get_session

router = APIRouter()

@router.post('/add')
def add_to_watchlist(user_id: int, anime_id: int, session=Depends(get_session)):
    entry = Watchlist(user_id=user_id, anime_id=anime_id)
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry

@router.get('/list/{user_id}')
def get_watchlist(user_id: int, session=Depends(get_session)):
    entries = session.exec(select(Watchlist).where(Watchlist.user_id == user_id)).all()
    return entries

@router.post('/remove')
def remove_from_watchlist(user_id: int, anime_id: int, session=Depends(get_session)):
    entry = session.exec(select(Watchlist).where(Watchlist.user_id == user_id, Watchlist.anime_id == anime_id)).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    session.delete(entry)
    session.commit()
    return {"message": "Removed from watchlist"}
