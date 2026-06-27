# 📌 Task Tracker

A production-style full-stack Kanban task management application built with **FastAPI**, **React**, and **PostgreSQL**. The application enables users to securely manage projects and tasks through JWT-based authentication, a RESTful API, and an interactive Kanban board.

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)

## 🌐 Live Links

* **Live Demo:** https://task-tracker-anshi.netlify.app
* **Backend API:** https://task-tracker-api-udkr.onrender.com
* **API Documentation (Swagger):** https://task-tracker-api-udkr.onrender.com/docs
* **GitHub Repository:** https://github.com/Anshi-Bhatnagar/Task-Tracker

> **Note:** The backend is hosted on Render's free tier. After approximately 15 minutes of inactivity, the first request may take **30–60 seconds** while the service wakes up.

---

# ✨ Features

* Secure user authentication using JWT
* Password hashing with bcrypt
* Project-based task organization
* Kanban board with:

  * To Do
  * In Progress
  * Done
* Task filtering by priority
* RESTful API built with FastAPI
* Request validation using Pydantic
* SQLAlchemy ORM with indexed database queries for efficient task retrieval.
* PostgreSQL relational database
* Per-user data isolation
* Responsive React frontend
* Fully deployed on Render and Netlify

---

# 🛠 Tech Stack

| Layer           | Technologies                      |
| --------------- | --------------------------------- |
| Frontend        | React, Vite                       |
| Backend         | FastAPI, SQLAlchemy, Pydantic     |
| Database        | PostgreSQL                        |
| Authentication  | OAuth2 Password Flow, JWT, bcrypt |
| Deployment      | Render, Netlify                   |
| Version Control | Git, GitHub                       |

---
## 🔄 Workflow

```text
Register/Login
      │
      ▼
Create Project
      │
      ▼
Create Tasks
      │
      ▼
Move Tasks Across Kanban Board
      │
      ▼
Filter Tasks by Priority
```

# 📂 Project Structure

```text
task-tracker/
│
├── backend/
│   ├── app/
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routers/
│   │       ├── auth.py
│   │       ├── projects.py
│   │       └── tasks.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

# 🗄 Database Design

```
Users
  │
  └──────< Projects
              │
              └──────< Tasks
```

### Relationships

* One User → Many Projects
* One Project → Many Tasks
* Optional Task Assignee
* Cascade deletion for Projects and Tasks
* Composite index on `(project_id, status)` for faster filtering

---

# 🚀 Deployment

The application is deployed as two separate services.

### Frontend (Netlify)

**Live URL**

https://task-tracker-anshi.netlify.app

Configuration

* Base Directory: `frontend`
* Build Command: `npm run build`
* Publish Directory: `dist`
* Environment Variable:

  * `VITE_API_URL`

---

### Backend (Render)

**Live URL**

https://task-tracker-api-udkr.onrender.com

Configuration

* Root Directory: `backend`
* Build Command:
  `pip install -r requirements.txt`
* Start Command:
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
* PostgreSQL database connected using the `DATABASE_URL` environment variable.

The backend is configured with `CORS_ORIGINS` so the deployed frontend can securely access the API.

---

# ⚙ Running Locally

## Prerequisites

* Python 3.11+
* Node.js 18+
* PostgreSQL

---

## Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env

python -m uvicorn app.main:app --reload
```

API Documentation:

```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

cp .env.example .env

npm run dev
```

Application:

```
http://localhost:5173
```

---

# 📖 API Endpoints

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| POST   | `/auth/register` | Register user  |
| POST   | `/auth/login`    | Login          |
| GET    | `/auth/me`       | Current user   |
| GET    | `/projects`      | List projects  |
| POST   | `/projects`      | Create project |
| DELETE | `/projects/{id}` | Delete project |
| GET    | `/tasks`         | List tasks     |
| POST   | `/tasks`         | Create task    |
| PATCH  | `/tasks/{id}`    | Update task    |
| DELETE | `/tasks/{id}`    | Delete task    |

All protected endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📸 Screenshots

* Login Page
  <img width="902" height="862" alt="image" src="https://github.com/user-attachments/assets/5f324181-ed17-467e-bd68-2d3156e4dcaa" />

* Register Page
  <img width="898" height="827" alt="image" src="https://github.com/user-attachments/assets/51402a9f-1071-4c4e-bb56-5d438e8a0ad5" />

* Kanban Board

<img width="1247" height="573" alt="image" src="https://github.com/user-attachments/assets/49cfdf00-876c-415c-9ebb-227a52097311" />


* Task Creation
<img width="355" height="298" alt="image" src="https://github.com/user-attachments/assets/9d0c1926-54c3-4799-9d46-6dfbf7ddd602" />

* Task Filtering
<img width="293" height="193" alt="image" src="https://github.com/user-attachments/assets/53d0e47b-dec5-470d-b290-6b05c6cb34d1" />

---

# 📚 What I Learned

Through this project I gained practical experience with:

* Designing REST APIs using FastAPI
* JWT authentication and authorization
* SQLAlchemy ORM
* PostgreSQL schema design
* React state management
* Frontend–backend integration
* Environment variable management
* Deploying production-ready applications using Render and Netlify
* Debugging deployment issues and configuring CORS

---

# 👩‍💻 Author

**Anshika Bhatnagar**

* GitHub: https://github.com/Anshi-Bhatnagar
* LinkedIn: https://www.linkedin.com/in/anshika-bhatnagar-136ba7318/
