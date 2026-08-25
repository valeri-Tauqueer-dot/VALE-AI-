import os
from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY not found in environment")

ALGORITHM = "HS256"
DEFAULT_TOKEN_MINUTES = 24 * 60
REMEMBER_TOKEN_DAYS = 30


def create_access_token(data: dict, expires_minutes: int = DEFAULT_TOKEN_MINUTES):
    now = datetime.now(timezone.utc)
    to_encode = data.copy()
    to_encode.update({
        "exp": now + timedelta(minutes=expires_minutes),
        "iat": now,
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        subject = payload.get("sub")
        return subject if subject else None
    except JWTError:
        return None
