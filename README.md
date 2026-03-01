# OTT Streaming App

Full-stack OTT-style streaming application with:
- `backend`: Django + Django REST Framework APIs
- `frontend`: React + Vite client

## Tech Stack
- Backend: Django 6, DRF, SQLite, CORS headers
- Frontend: React 19, Vite, Axios, React Router

## Project Structure
- `backend/` Django project (`config`) and app (`videos`)
- `frontend/` React application

## Prerequisites
- Python 3.12+ (3.14 also works if your packages support it)
- Node.js 20+
- npm

## Backend Setup (Django)
1. Open terminal in `backend`:
```powershell
cd backend
```
2. Create virtual environment:
```powershell
python -m venv venv
```
3. Activate venv (Windows PowerShell):
```powershell
.\venv\Scripts\Activate.ps1
```
4. Install dependencies:
```powershell
pip install -r requirements.txt
```
5. Run migrations:
```powershell
python manage.py migrate
```
6. Start backend server:
```powershell
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

## Frontend Setup (React + Vite)
1. Open a new terminal and go to `frontend`:
```powershell
cd frontend
```
2. Install dependencies:
```powershell
npm install
```
3. Start development server:
```powershell
npm run dev
```

Frontend runs at `http://127.0.0.1:5173` (or `http://localhost:5173`).

## API Notes
Configured backend routes include:
- `POST /api/login/`
- `POST /api/signup/`
- `POST /api/logout/`
- `GET /api/check-auth/`
- `videos/` routes from `videos.urls`

Frontend Axios base URL is set to `http://127.0.0.1:8000` with credentials enabled.

## Media and Database
- Uploaded media is stored in `backend/media/`.
- Local development database is `backend/db.sqlite3`.

## Git
Use the root `.gitignore` to avoid committing local artifacts like:
- `backend/venv/`
- `frontend/node_modules/`
- `backend/media/`
- `backend/db.sqlite3`

## Production Reminder
Current Django settings are development-oriented (`DEBUG=True` and a hardcoded `SECRET_KEY`).
Before deployment, move secrets to environment variables and set `DEBUG=False`.
