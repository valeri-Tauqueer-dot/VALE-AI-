# VALE — Original Design + Secure Render Backend

This package uses the original VALE 3.10 Ultra HD Deep Core frontend as `index.html`.
Only the authentication/registration/backend bridge was added. The existing VALE dashboard, sections, visual system, animations, charts, and navigation remain in the original file.

## Render

Build command:
`pip install -r requirements.txt`

Start command:
`uvicorn main:app --host 0.0.0.0 --port $PORT`

Required environment variables:
- `DATABASE_URL` — Supabase/PostgreSQL connection string copied from Supabase Connect.
- `SECRET_KEY` — a long random secret used to sign VALE sessions.

Do not put secrets in `index.html` or commit them to GitHub.

## Authentication flow

1. New operator chooses `NEW OPERATOR? CREATE VALE ACCESS`.
2. Operator registers name, email, and a new VALE-only password.
3. Registration returns to the original VALE login screen with the email filled in.
4. Operator logs in with the VALE email + VALE password.
5. `Remember this device` creates a secure HttpOnly session cookie lasting 30 days.
6. Without remember, the session lasts 24 hours.
7. Logout clears the server session cookie.
8. Chat calls the authenticated `/chat` endpoint.

The website never needs the user's real email-provider password.
