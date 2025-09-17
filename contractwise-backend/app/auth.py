from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
import os
from datetime import datetime, timedelta
from app.db import supabase

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = HTTPBearer()


SECRET_KEY = os.getenv("JWT_SECRET", "secret")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


# ----- Schemas -----
class UserSignup(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


# ----- Helpers -----
def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


# ----- Routes -----
@router.post("/signup")
def signup(user: UserSignup):
    # check if exists
    res = supabase.table("users").select("*").eq("username", user.username).execute()
    if res.data:
        raise HTTPException(status_code=400, detail="email already exists")

    hashed_pw = pwd_context.hash(user.password)

    new_user = (
        supabase.table("users")
        .insert({"username": user.username, "password_hash": hashed_pw})
        .execute()
    )

    return {"message": "User created", "user": new_user.data[0]}


@router.post("/login")
def login(user: UserLogin):
    res = supabase.table("users").select("*").eq("username", user.username).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    user_data = res.data[0]
    if not pwd_context.verify(user.password, user_data["password_hash"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"sub": str(user_data["user_id"])})
    return {"access_token": token, "token_type": "bearer"}
