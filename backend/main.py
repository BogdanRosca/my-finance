from database_client import DatabaseClient
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import health, overview, user_settings

app = FastAPI()
db_client = DatabaseClient()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(overview.router)
app.include_router(user_settings.router)