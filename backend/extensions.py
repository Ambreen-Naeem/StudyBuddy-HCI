"""Shared Flask extension instances.

Defined here (separate from app.py) to avoid circular imports: models and
route blueprints import `db`/`jwt` from this module, and the app factory
initialises them against the application instance.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

# Database ORM
db = SQLAlchemy()

# JSON Web Token manager for authentication
jwt = JWTManager()
