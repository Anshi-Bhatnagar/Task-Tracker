import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, projects, tasks

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Tracker API", version="1.0.0")

# CORS: allow the local React dev server / configurable origin for production
allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "task-tracker-api"}


@app.get("/health")
def health():
    return {"status": "healthy"}
