"""StudyBuddy backend application factory.

Run directly to start the dev server (creates + seeds the SQLite DB on first
run):

    python app.py

Or use the Flask CLI:

    flask --app app init-db    # create tables + seed demo data
    flask --app app run
"""
import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from extensions import db, jwt

# Import models so SQLAlchemy is aware of them when creating tables.
import models  # noqa: F401

# Blueprints
from routes.auth import auth_bp
from routes.subjects import subjects_bp
from routes.groups import groups_bp
from routes.syllabus import syllabus_bp
from routes.progress import progress_bp
from routes.tasks import tasks_bp
from routes.notifications import notifications_bp
from routes.dashboard import dashboard_bp
from routes.discussion import discussion_bp

from seed import seed_demo_data


def create_app(config_class=Config):
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # --- Init extensions ---
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    # --- Register blueprints ---
    app.register_blueprint(auth_bp)
    app.register_blueprint(subjects_bp)
    app.register_blueprint(groups_bp)
    app.register_blueprint(syllabus_bp)
    app.register_blueprint(progress_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(discussion_bp)

    # --- Health check ---
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "StudyBuddy API"}), 200

    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "service": "StudyBuddy API",
            "health": "/api/health",
            "docs": "See README.md for the full endpoint list.",
        }), 200

    # --- JSON error handlers (HCI: consistent, clear error responses) ---
    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "Resource not found."}), 404

    @app.errorhandler(405)
    def method_not_allowed(_):
        return jsonify({"error": "Method not allowed for this endpoint."}), 405

    @app.errorhandler(500)
    def server_error(_):
        return jsonify({"error": "An internal server error occurred."}), 500

    # --- JWT error handlers ---
    @jwt.unauthorized_loader
    def missing_token(_):
        return jsonify({"error": "Missing or invalid Authorization header."}), 401

    @jwt.invalid_token_loader
    def invalid_token(_):
        return jsonify({"error": "Invalid token."}), 401

    @jwt.expired_token_loader
    def expired_token(_jwt_header, _jwt_payload):
        return jsonify({"error": "Token has expired. Please log in again."}), 401

    # --- CLI command: flask --app app init-db ---
    @app.cli.command("init-db")
    def init_db_command():
        """Create tables and seed demo data."""
        db.create_all()
        seeded = seed_demo_data()
        print("Database initialised." + (" Demo data seeded." if seeded else " (already seeded)"))

    return app


def init_db(app):
    """Create all tables and seed demo data within an app context."""
    with app.app_context():
        db.create_all()
        seed_demo_data()


# Create a module-level app for `flask --app app` and `python app.py`.
app = create_app()


if __name__ == "__main__":
    # On first run, create the schema and seed demo data automatically.
    init_db(app)
    app.run(debug=True, host="0.0.0.0", port=5000)
