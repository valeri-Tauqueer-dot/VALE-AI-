import os
import re

from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker
import bcrypt

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not found in environment")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(120), unique=True, nullable=False, index=True)
    email = Column(String(320), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)


# Safe startup migration for a new Render database. Existing compatible tables are kept.
Base.metadata.create_all(bind=engine)


def hash_password(password: str) -> str:
    raw = password.encode("utf-8")
    if len(raw) > 72:
        raise ValueError("Password cannot be longer than 72 bytes.")
    return bcrypt.hashpw(raw, bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    raw = password.encode("utf-8")
    if len(raw) > 72:
        return False
    try:
        return bcrypt.checkpw(raw, password_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def normalize_email(email: str) -> str:
    return email.strip().lower()


def normalize_name(name: str) -> str:
    return re.sub(r"\s+", " ", name.strip())


def create_user(name: str, email: str, password: str):
    name = normalize_name(name)
    email = normalize_email(email)

    if not name or len(name) > 120:
        return False, "Please enter a valid name."
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return False, "Please enter a valid email address."
    if len(password) < 8:
        return False, "Your VALE password must be at least 8 characters."
    if len(password.encode("utf-8")) > 72:
        return False, "Your VALE password is too long."

    db = SessionLocal()
    try:
        if db.query(User).filter(User.email == email).first():
            return False, "An account with this email already exists."
        if db.query(User).filter(User.username == name).first():
            return False, "That name is already registered. Choose another name."

        user = User(username=name, email=email, password_hash=hash_password(password))
        db.add(user)
        db.commit()
        return True, "Account created successfully."
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def login_user(email: str, password: str):
    email = normalize_email(email)
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            return None
        return user
    finally:
        db.close()
