# VALE — Secure Render Deployment

This package runs the VALE frontend and FastAPI backend from the same Render Web Service.

## Environment variables

Set these in Render → Environment:

- `DATABASE_URL` — your Supabase PostgreSQL connection string.
- `SECRET_KEY` — a long random secret used to sign sessions.

## Start command

```text
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Authentication flow

1. A new user opens VALE and chooses **Create VALE Access**.
2. They register a display name, email, and a new VALE-only password. Their normal email/account password is never requested or stored.
3. After successful registration, VALE switches to the email/password login screen and pre-fills the registered email.
4. If **Remember this device** is checked, the server stores the signed session in an HttpOnly, Secure, SameSite cookie for 30 days.
5. If it is not checked, the browser receives a session cookie and the signed token expires after 24 hours.
6. The password is stored only as a bcrypt hash in PostgreSQL; it is never stored in the browser.
7. Logout calls `/logout` and clears the server-issued cookie.

The browser does not store the JWT in localStorage/sessionStorage.
