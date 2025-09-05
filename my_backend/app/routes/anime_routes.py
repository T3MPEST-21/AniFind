
from fastapi import APIRouter, Depends
from sqlmodel import select
from app.models.anime import Anime
from app.services.database import get_session
from app.services.cache import cache_get, cache_set
import asyncio

router = APIRouter()



@router.get('/')
async def list_anime(skip: int = 0, limit: int = 20, session=Depends(get_session)):
    cache_key = f"anime_list_{skip}_{limit}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    statement = select(Anime).offset(skip).limit(limit)
    animes = session.exec(statement).all()
    await cache_set(cache_key, animes, expire=60)
    return animes



@router.get('/search')
def search_anime(title: str = None, genre: str = None, year: int = None, min_rating: int = None, skip: int = 0, limit: int = 20, session=Depends(get_session)):
    statement = select(Anime)
    if title:
        statement = statement.where(Anime.title.contains(title))
    if genre:
        statement = statement.where(Anime.genre.contains(genre))
    if year:
        statement = statement.where(Anime.year == year)
    # If you add rating to Anime model, filter by min_rating
    statement = statement.offset(skip).limit(limit)
    results = session.exec(statement).all()
    return results

# Simple recommendation: return random anime
import random
@router.get('/recommend')
def recommend_anime(session=Depends(get_session)):
    animes = session.exec(select(Anime)).all()
    if not animes:
        return []
    return random.sample(animes, min(3, len(animes)))
