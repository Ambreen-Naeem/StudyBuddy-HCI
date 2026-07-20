"""Task & deadline planner routes (/api/tasks)."""
from datetime import datetime

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Task

tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")

VALID_TYPES = {"task", "deadline"}
VALID_STATUSES = {"pending", "done"}
VALID_PRIORITIES = {"low", "med", "high"}


def _parse_date(value):
    """Parse an ISO date/datetime string; return None if missing/invalid."""
    if not value:
        return None
    try:
        # Accept both date and full datetime ISO strings
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return None


@tasks_bp.route("", methods=["GET"])
@jwt_required()
def list_tasks():
    """List tasks for the current user.

    Optional filters:
        status, type, priority
        week=YYYY-WW  (ISO week) OR month=YYYY-MM
    """
    user_id = get_jwt_identity()
    query = Task.query.filter_by(user_id=user_id)

    for field in ["status", "type", "priority"]:
        val = request.args.get(field)
        if val:
            query = query.filter(getattr(Task, field) == val)

    tasks = query.order_by(Task.due_date.asc().nullslast()).all()

    # Filter by month (YYYY-MM) or ISO week (YYYY-WW) in Python for clarity
    month = request.args.get("month")
    week = request.args.get("week")
    if month:
        tasks = [t for t in tasks if t.due_date and t.due_date.strftime("%Y-%m") == month]
    elif week:
        def iso_week(t):
            iso = t.due_date.isocalendar()
            return f"{iso[0]}-{iso[1]:02d}"
        tasks = [t for t in tasks if t.due_date and iso_week(t) == week]

    return jsonify([t.to_dict() for t in tasks]), 200


@tasks_bp.route("/<int:task_id>", methods=["GET"])
@jwt_required()
def get_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({"error": "Task not found."}), 404
    return jsonify(task.to_dict()), 200


@tasks_bp.route("", methods=["POST"])
@jwt_required()
def create_task():
    """Create a task or deadline."""
    user_id = get_jwt_identity()
    data = request.get_json(silent=True) or {}

    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Task title is required."}), 400

    ttype = data.get("type", "task")
    if ttype not in VALID_TYPES:
        return jsonify({"error": "Type must be 'task' or 'deadline'."}), 400

    priority = data.get("priority", "med")
    if priority not in VALID_PRIORITIES:
        return jsonify({"error": "Priority must be 'low', 'med', or 'high'."}), 400

    task = Task(
        user_id=user_id,
        title=title,
        description=data.get("description"),
        due_date=_parse_date(data.get("due_date")),
        type=ttype,
        status="pending",
        priority=priority,
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({"message": "Task created.", "task": task.to_dict()}), 201


@tasks_bp.route("/<int:task_id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_task(task_id):
    """Update a task's fields."""
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({"error": "Task not found."}), 404

    data = request.get_json(silent=True) or {}

    if "type" in data and data["type"] not in VALID_TYPES:
        return jsonify({"error": "Type must be 'task' or 'deadline'."}), 400
    if "status" in data and data["status"] not in VALID_STATUSES:
        return jsonify({"error": "Status must be 'pending' or 'done'."}), 400
    if "priority" in data and data["priority"] not in VALID_PRIORITIES:
        return jsonify({"error": "Priority must be 'low', 'med', or 'high'."}), 400

    for field in ["title", "description", "type", "status", "priority"]:
        if field in data:
            setattr(task, field, data[field])
    if "due_date" in data:
        task.due_date = _parse_date(data["due_date"])

    db.session.commit()
    return jsonify({"message": "Task updated.", "task": task.to_dict()}), 200


@tasks_bp.route("/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({"error": "Task not found."}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted."}), 200
