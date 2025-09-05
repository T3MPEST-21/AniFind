from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from app.models.user import User
from app.models.anime import Anime
from app.services.database import get_session

router = APIRouter()

@router.get('/users')
def list_users(session=Depends(get_session)):
    return session.exec(select(User)).all()

@router.delete('/user/{username}')
def delete_user(username: str, session=Depends(get_session)):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return {"message": "User deleted"}

@router.get('/animes')
def list_animes(session=Depends(get_session)):
    return session.exec(select(Anime)).all()

@router.delete('/anime/{anime_id}')
def delete_anime(anime_id: int, session=Depends(get_session)):
    statement = select(Anime).where(Anime.id == anime_id)
    anime = session.exec(statement).first()
    if not anime:
        raise HTTPException(status_code=404, detail="Anime not found")
    session.delete(anime)
    session.commit()
    return {"message": "Anime deleted"}
