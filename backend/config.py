"""Application configuration for StudyBuddy backend."""
import os
from datetime import timedelta

# Base directory of the backend package
BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    """Central configuration object loaded by the Flask app factory."""

    # Secret keys (override via environment variables in production)
    SECRET_KEY = os.environ.get("SECRET_KEY", "studybuddy-dev-secret-key-change-me")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "studybuddy-jwt-secret-key-change-me")

    # JWT tokens are valid for 7 days (convenient for a demoable project)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    # SQLite database stored next to the application code
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///" + os.path.join(BASE_DIR, "studybuddy.db")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS: allow all origins by default so the frontend (any port) can call the API
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")
