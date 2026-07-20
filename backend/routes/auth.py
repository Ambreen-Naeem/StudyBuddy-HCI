"""Authentication & current-user profile routes (/api/auth/...)."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    """Create a new user account and return a JWT."""
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    # --- Input validation (HCI: prevent errors with clear messages) ---
    if not name:
        return jsonify({"error": "Name is required."}), 400
    if not email:
        return jsonify({"error": "Email is required."}), 400
    if "@" not in email:
        return jsonify({"error": "Please enter a valid email address."}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists."}), 409

    user = User(
        name=name,
        email=email,
        university=data.get("university"),
        semester=data.get("semester"),
        study_preferences=data.get("study_preferences"),
        availability_schedule=data.get("availability_schedule"),
        learning_style=data.get("learning_style"),
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Account created.", "token": token, "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate a user and return a JWT."""
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Logged in.", "token": token, "user": user.to_dict()}), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Stateless JWT logout.

    With stateless JWTs the client simply discards the token. This endpoint
    exists so the frontend has a consistent place to call on logout.
    """
    return jsonify({"message": "Logged out. Please discard your token."}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    """Return the currently authenticated user's profile."""
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify(user.to_dict()), 200


@auth_bp.route("/me", methods=["PUT", "PATCH"])
@jwt_required()
def update_me():
    """Update the current user's editable profile fields."""
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.get_json(silent=True) or {}

    # Only allow editing safe, user-owned fields
    editable = [
        "name", "university", "semester", "study_preferences",
        "availability_schedule", "learning_style",
    ]
    for field in editable:
        if field in data:
            setattr(user, field, data[field])

    # Allow password change with validation
    if data.get("password"):
        if len(data["password"]) < 6:
            return jsonify({"error": "Password must be at least 6 characters long."}), 400
        user.set_password(data["password"])

    db.session.commit()
    return jsonify({"message": "Profile updated.", "user": user.to_dict()}), 200
