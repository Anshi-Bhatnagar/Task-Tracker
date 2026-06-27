# Task Tracker

A full-stack kanban-style task management app. FastAPI backend, React frontend, PostgreSQL database via SQLAlchemy.

![status](https://img.shields.io/badge/status-working-brightgreen)

🔗 **Live demo:** _add your Netlify URL here once deployed_
🔗 **Repo:** [github.com/Anshi-Bhatnagar/task-tracker](https://github.com/Anshi-Bhatnagar/task-tracker)

> Note: the backend runs on Render's free tier, which spins down after 15 minutes of inactivity. If the demo feels slow on first load, that's the backend waking up — give it ~30-60 seconds.

## Features

- Email/password authentication with JWT, hashed passwords (bcrypt)
- Create projects, add tasks under them
- Move tasks across To Do / In Progress / Done
- Filter tasks by priority
- REST API with request validation via Pydantic
- Per-user data isolation (you only ever see your own projects/tasks)

## Stack

| Layer    | Tech |
|----------|------|
| Backend  | FastAPI, SQLAlchemy ORM, Pydantic, python-jose (JWT), bcrypt |
| Database | PostgreSQL |
| Frontend | React (Vite), plain CSS-in-JS (no framework) |
| Auth     | OAuth2 password flow + JWT bearer tokens |

## Project structure

```
task-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, router registration
│   │   ├── config.py        # env-based settings
│   │   ├── database.py      # SQLAlchemy engine/session
│   │   ├── models.py        # User, Project, Task ORM models
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   ├── auth.py          # password hashing, JWT creation/verification
│   │   └── routers/
│   │       ├── auth.py      # /auth/register, /auth/login, /auth/me
│   │       ├── projects.py  # /projects CRUD
│   │       └── tasks.py     # /tasks CRUD + filtering
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/client.js         # fetch wrapper, talks to the backend
        ├── context/AuthContext.jsx
        ├── pages/AuthPage.jsx    # login / register
        ├── pages/BoardPage.jsx   # the kanban board
        └── components/
            ├── TaskCard.jsx
            └── NewTaskForm.jsx
```

## Data model

```
users ──┬─< projects >──┬─< tasks
        │   (owner_id)   │  (project_id, assignee_id)
```

- `users.email` and `users.username` are unique
- `projects.owner_id` → `users.id`, cascade delete (deleting a user removes their projects)
- `tasks.project_id` → `projects.id`, cascade delete
- `tasks.assignee_id` → `users.id`, nullable, sets to NULL on user delete
- Composite index on `(project_id, status)` for the common "tasks in this project, filtered by status" query
- Separate indexes on `status`, `priority`, `assignee_id` for standalone filters

## Deployment

This is deployed as two separate services:

- **Frontend** → [Netlify](https://netlify.com) — base directory `frontend`, build command `npm run build`, publish directory `frontend/dist`, env var `VITE_API_URL` set to the backend URL.
- **Backend + Database** → [Render](https://render.com) — web service with root directory `backend`, build command `pip install -r requirements.txt`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, connected to a Render PostgreSQL instance via the `DATABASE_URL` env var.

After deploying both, set `CORS_ORIGINS` on the backend to the live Netlify URL so the frontend can call the API.

## Running it locally

### Prerequisites

- Python 3.11+
- Node 18+
- PostgreSQL running locally

### 1. Database

```bash
sudo -u postgres psql -c "CREATE USER tasktracker WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "CREATE DATABASE tasktracker_db OWNER tasktracker;"
```

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then fill in your DB password / secret key

uvicorn app.main:app --reload --port 8000
```

Tables are created automatically on startup. API docs at `http://localhost:8000/docs`.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env            # defaults to localhost:8000, change if needed
npm run dev
```

App runs at `http://localhost:5173`.

## API overview

| Method | Endpoint            | Description                              |
|--------|----------------------|-------------------------------------------|
| POST   | `/auth/register`     | Create an account                         |
| POST   | `/auth/login`         | Get a JWT (OAuth2 password flow)          |
| GET    | `/auth/me`            | Current user                              |
| GET    | `/projects`           | List your projects                        |
| POST   | `/projects`           | Create a project                          |
| DELETE | `/projects/{id}`      | Delete a project                          |
| GET    | `/tasks`              | List tasks (filter by `project_id`, `status_filter`, `priority`, `assignee_id`) |
| POST   | `/tasks`              | Create a task                             |
| PATCH  | `/tasks/{id}`         | Update a task (partial)                   |
| DELETE | `/tasks/{id}`         | Delete a task                             |

All endpoints except register/login require `Authorization: Bearer <token>`.

## Notes

This was built as a focused project to get hands-on with a backend stack (FastAPI + PostgreSQL + SQLAlchemy) end to end — schema design, auth, and a REST API consumed by a real frontend, rather than just following a tutorial.
