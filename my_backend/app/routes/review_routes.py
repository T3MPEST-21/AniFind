from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from app.models.review import Review
from app.services.database import get_session

router = APIRouter()

@router.post('/add')
def add_review(user_id: int, anime_id: int, rating: int, comment: str, session=Depends(get_session)):
    review = Review(user_id=user_id, anime_id=anime_id, rating=rating, comment=comment)
    session.add(review)
    session.commit()
    session.refresh(review)
    return review

@router.get('/anime/{anime_id}')
def get_reviews_for_anime(anime_id: int, session=Depends(get_session)):
    reviews = session.exec(select(Review).where(Review.anime_id == anime_id)).all()
    return reviews

@router.get('/user/{user_id}')
def get_reviews_by_user(user_id: int, session=Depends(get_session)):
    reviews = session.exec(select(Review).where(Review.user_id == user_id)).all()
    return reviews
