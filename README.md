# TaskFlow — Team Task Manager

A production-quality full-stack task management application with role-based access control, JWT authentication, project management, and real-time dashboard analytics.

---

## Live Demo

> Deploy to Railway using the steps below. Demo accounts are seeded automatically.

---

## Features

### Authentication
- JWT-based signup / login
- Secure bcrypt password hashing
- Protected routes (frontend + backend)

### Role-Based Access Control
| Feature                    | Admin | Member |
|----------------------------|-------|--------|
| Create projects            | ✅    | ❌     |
| Add / remove members       | ✅    | ❌     |
| Create / assign tasks      | ✅    | ❌     |
| Update / delete tasks      | ✅    | ❌     |
| Update own task status     | ✅    | ✅     |
| View assigned projects     | ✅    | ✅     |
| View dashboard analytics   | ✅    | ✅     |

### Core Modules
- **Dashboard** — total, completed, pending, overdue task stats + recent activity
- **Projects** — create projects, manage team members, view project tasks
- **Tasks** — filterable table, status/priority badges, inline status update

---

## Tech Stack

### Backend
| Layer        | Technology               |
|--------------|--------------------------|
| Framework    | FastAPI                  |
| ORM          | SQLAlchemy 2.0           |
| Validation   | Pydantic v2              |
| Auth         | JWT (python-jose)        |
| Hashing      | passlib + bcrypt         |
| Database     | PostgreSQL               |
| Server       | Uvicorn                  |

### Frontend
| Layer        | Technology               |
|--------------|--------------------------|
| Framework    | React 18 + Vite          |
| Routing      | React Router v6          |
| HTTP         | Axios                    |
| Styling      | Tailwind CSS             |
| Icons        | Lucide React             |
| Toasts       | React Hot Toast          |
| Date utils   | date-fns                 |

---

## Project Structure

```
team-task-manager/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app + CORS + startup
│   │   ├── config.py          # Settings (pydantic-settings)
│   │   ├── database.py        # SQLAlchemy engine + session
│   │   ├── models/            # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   └── task.py
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   │   ├── auth.py
│   │   │   ├── project.py
│   │   │   ├── task.py
│   │   │   └── dashboard.py
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── projects.py
│   │   │   ├── tasks.py
│   │   │   ├── dashboard.py
│   │   │   └── users.py
│   │   └── auth/
│   │       └── jwt.py         # Token creation, hashing, dependencies
│   ├── seed.py                # Demo data seeder
│   ├── requirements.txt
│   ├── railway.toml
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js          # Axios instance + API modules
    │   ├── layouts/
    │   │   └── AppLayout.jsx   # Sidebar + navbar shell
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ProjectsPage.jsx
    │   │   ├── ProjectDetailPage.jsx
    │   │   └── TasksPage.jsx
    │   ├── components/
    │   │   ├── Modal.jsx
    │   │   ├── TaskForm.jsx
    │   │   ├── TaskRow.jsx
    │   │   ├── TaskBadges.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── EmptyState.jsx
    │   └── utils/
    │       └── helpers.js
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── railway.toml
    └── .env.example
```

---

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL running locally

### 1. Clone

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set your DATABASE_URL and SECRET_KEY

# Seed demo data
python seed.py

# Start server
uvicorn app.main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

App available at: `http://localhost:5173`

---

## API Reference

### Authentication

| Method | Endpoint       | Description          | Auth |
|--------|----------------|----------------------|------|
| POST   | /auth/signup   | Create account       | ❌   |
| POST   | /auth/login    | Login, get JWT       | ❌   |
| GET    | /auth/me       | Current user info    | ✅   |

### Projects

| Method | Endpoint                         | Description          | Role   |
|--------|----------------------------------|----------------------|--------|
| POST   | /projects                        | Create project       | Admin  |
| GET    | /projects                        | List projects        | Any    |
| GET    | /projects/{id}                   | Project + members    | Any    |
| POST   | /projects/{id}/members           | Add member           | Admin  |
| DELETE | /projects/{id}/members/{user_id} | Remove member        | Admin  |

### Tasks

| Method | Endpoint      | Description                 | Role          |
|--------|---------------|-----------------------------|---------------|
| POST   | /tasks        | Create task                 | Admin         |
| GET    | /tasks        | List tasks (with filters)   | Any           |
| PATCH  | /tasks/{id}   | Update task                 | Admin / Owner |
| DELETE | /tasks/{id}   | Delete task                 | Admin         |

### Dashboard

| Method | Endpoint    | Description           | Auth |
|--------|-------------|-----------------------|------|
| GET    | /dashboard  | Analytics stats       | ✅   |

### Users

| Method | Endpoint | Description    | Auth |
|--------|----------|----------------|------|
| GET    | /users   | List all users | ✅   |

---

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/taskmanager
SECRET_KEY=change-this-to-a-long-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

---

## Deployment on Railway

### Step 1 — Create Railway project

1. Go to [railway.app](https://railway.app) and log in
2. Click **New Project** → **Empty Project**

### Step 2 — Add PostgreSQL

1. Click **+ Add Service** → **Database** → **PostgreSQL**
2. Railway auto-generates `DATABASE_URL` — copy it

### Step 3 — Deploy Backend

1. Click **+ Add Service** → **GitHub Repo** → select your repo
2. Set **Root Directory** to `backend`
3. Add environment variables:
   ```
   DATABASE_URL=<from step 2>
   SECRET_KEY=<generate with: openssl rand -hex 32>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   ```
4. Deploy — Railway detects `railway.toml` automatically
5. Copy the generated backend URL (e.g. `https://taskflow-api.up.railway.app`)

### Step 4 — Seed Database

In the Railway backend service shell (or locally with the production `DATABASE_URL`):
```bash
python seed.py
```

### Step 5 — Deploy Frontend

1. Click **+ Add Service** → **GitHub Repo** → same repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app
   ```
4. Deploy — Railway runs `npm run build` automatically

### Step 6 — Done

Visit your frontend Railway URL. Log in with demo accounts.

---

## Database Schema

```
users
  id, name, email, password_hash, role (admin|member), created_at

projects
  id, title, description, created_by → users.id, created_at

project_members
  id, project_id → projects.id, user_id → users.id

tasks
  id, title, description, status (Todo|In Progress|Done),
  priority (Low|Medium|High), due_date, assigned_to → users.id,
  project_id → projects.id, created_by → users.id, created_at
```

---

## Security

- Passwords hashed with bcrypt (never stored in plain text)
- JWT tokens expire after 60 minutes (configurable)
- All private routes require `Authorization: Bearer <token>` header
- Member role restrictions enforced at API level — not just frontend
- CORS configured (set specific origins in production)

---

## License

MIT
