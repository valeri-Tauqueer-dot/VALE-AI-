from pathlib import Path

from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, EmailStr

from ai_core import vale
from database import create_user, login_user
from auth import create_access_token, verify_token, DEFAULT_TOKEN_MINUTES, REMEMBER_TOKEN_DAYS

BASE_DIR = Path(__file__).resolve().parent
INDEX_FILE = BASE_DIR / "index.html"

app = FastAPI(title="VALE AI Core", version="2.0")

# The frontend is served by this same service. CORS is kept permissive for future API use.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)
AUTH_COOKIE = "vale_session"


class UserMessage(BaseModel):
    message: str = Field(min_length=1, max_length=10000)


class SignupData(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class LoginData(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)
    remember: bool = False


def _token_from_request(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None,
):
    # Prefer the HttpOnly cookie used by the web app.
    token = request.cookies.get(AUTH_COOKIE)
    if token:
        return token
    # Keep bearer-token support for API clients.
    if credentials:
        return credentials.credentials
    return None


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
):
    token = _token_from_request(request, credentials)
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required.")

    email = verify_token(token)
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    return email


@app.get("/")
def home():
    return FileResponse(INDEX_FILE, media_type="text/html")


@app.get("/health")
def health():
    return {"status": "healthy", "system": "VALE AI", "database": "connected"}


@app.post("/chat")
def chat(data: UserMessage, email: str = Depends(get_current_user)):
    response = vale.process(data.message)
    return {"user": data.message, "vale": response}


@app.post("/signup")
def signup(data: SignupData):
    success, message = create_user(data.name, str(data.email), data.password)
    return {"success": success, "message": message}


@app.post("/login")
def login(data: LoginData, response: Response):
    user = login_user(str(data.email), data.password)
    if not user:
        # Do not reveal whether the email exists.
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    minutes = REMEMBER_TOKEN_DAYS * 24 * 60 if data.remember else DEFAULT_TOKEN_MINUTES
    token = create_access_token({"sub": user.email}, expires_minutes=minutes)

    cookie_kwargs = {
        "key": AUTH_COOKIE,
        "value": token,
        "httponly": True,
        "secure": True,
        "samesite": "lax",
        "path": "/",
    }
    if data.remember:
        cookie_kwargs["max_age"] = REMEMBER_TOKEN_DAYS * 24 * 60 * 60
    response.set_cookie(**cookie_kwargs)

    return {
        "success": True,
        "message": "Authenticated.",
        "user": {"name": user.username, "email": user.email},
        "remembered": data.remember,
    }


@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(AUTH_COOKIE, path="/")
    return {"success": True}


@app.get("/profile")
def profile(email: str = Depends(get_current_user)):
    return {"email": email, "status": "Authenticated", "system": "VALE AI"}
