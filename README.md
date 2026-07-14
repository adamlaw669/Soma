# Soma

AI symptom checker. A patient answers a short symptom questionnaire; an XGBoost
classifier returns a probability distribution over candidate conditions plus a
triage suggestion. A separate doctor view lets a reviewer approve or correct
predictions.

Originally built for the AltSchool Africa Hackathon 2025. This is a personal
project I'm continuing to work on — not a production medical service.

> **Not medical advice.** Soma is a learning project. Do not use its output to
> make real medical decisions.

## Stack

**Frontend** (`frontend/`)
- Next.js 15 (App Router), TypeScript, React 18
- Tailwind CSS 4, shadcn/ui + Radix primitives
- Zustand for client state
- Deployed on Vercel

**Backend** (`backend/`)
- FastAPI + Uvicorn (Python 3.9+)
- SQLAlchemy + SQLite (`soma.db`, auto-created on first run)
- Model: XGBoost, loaded from `app/models/soma_model_v1.joblib`
- SlowAPI for rate limiting
- Deployed on Render

## Auth model

- **Patients** have no accounts. A random session ID (`crypto.randomUUID`) is
  stored in `localStorage` via Zustand and attached to their reports.
- **Doctors** log in with a shared secret (`DOCTOR_API_KEY`). It's validated
  against the backend and cached in `sessionStorage`. Any doctor-facing API
  call sends it as `Authorization: Bearer <key>`.

## Run locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate           # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                # then edit DOCTOR_API_KEY
uvicorn app.main:app --reload
```

API docs: <http://localhost:8000/docs>

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local          # then edit values
npm run dev
```

App: <http://localhost:3000>

## Environment variables

**Backend** (`backend/.env`)
- `DATABASE_URL` — SQLAlchemy URL, defaults to `sqlite:///./soma.db`
- `ALLOWED_ORIGINS` — comma-separated CORS origins to add to the built-in defaults
- `DOCTOR_API_KEY` — required; a strong random secret for the doctor portal

**Frontend** (`frontend/.env.local`)
- `NEXT_PUBLIC_API_BASE_URL` — backend URL (leave unset in dev to use local API routes)
- `DOCTOR_API_KEY` — must match the backend value (server-side only, never `NEXT_PUBLIC_`)

## Project layout

```
backend/
  app/
    api/         # FastAPI routers: predict, diagnoses, doctor, diseases, report
    services/    # predictor, diagnosis service, doctor service, report service
    models/      # SQLAlchemy models + the joblib artifact
    schemas.py   # Pydantic request/response schemas
    db.py        # SQLAlchemy engine + session
    main.py      # app factory + CORS + rate limit + lifespan
  requirements.txt

frontend/
  app/           # Next.js App Router pages (check, result, history, doctor, ...)
    api/         # Next.js route handlers used as fallbacks / server-only auth
  components/    # Feature components + shadcn/ui primitives under components/ui
  lib/           # api.ts, store.ts, types.ts, questions.ts, utils.ts
```

## License

MIT — see [LICENSE](LICENSE).
