from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from app.models.user import User
from app.services.database import get_session
from app.services.auth import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.get('/profile/{username}')
def get_profile(username: str, session=Depends(get_session)):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put('/profile/{username}')
def update_profile(username: str, email: str = None, password: str = None, session=Depends(get_session)):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if email:
        user.email = email
    if password:
        user.password = get_password_hash(password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from app.models.user import User
from app.services.database import get_session
from app.services.auth import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.post('/register')
def register_user(user: User, session=Depends(get_session)):
    user.password = get_password_hash(user.password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "User registered successfully", "user": user}

@router.post('/login')
def login_user(username: str, password: str, session=Depends(get_session)):
    statement = select(User).where(User.username == username)
    result = session.exec(statement).first()
    if not result or not verify_password(password, result.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"sub": result.username})
    return {"access_token": access_token, "token_type": "bearer"}
