"""CRUD routes for a user's subjects (/api/subjects)."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Subject, Progress

subjects_bp = Blueprint("subjects", __name__, url_prefix="/api/subjects")


@subjects_bp.route("", methods=["GET"])
@jwt_required()
def list_subjects():
    """List all subjects owned by the current user, each annotated with topic
    counts (total + completed for this user) so cards can show progress.
    """
    user_id = get_jwt_identity()
    subjects = Subject.query.filter_by(user_id=user_id).order_by(Subject.created_at.desc()).all()

    result = []
    for subject in subjects:
        topics = [t for syl in subject.syllabi for t in syl.topics]
        topic_ids = [t.id for t in topics]
        completed = 0
        if topic_ids:
            completed = Progress.query.filter(
                Progress.user_id == user_id,
                Progress.topic_id.in_(topic_ids),
                Progress.status == "completed",
            ).count()
        data = subject.to_dict()
        data["total_topics"] = len(topics)
        data["completed_topics"] = completed
        result.append(data)

    return jsonify(result), 200


@subjects_bp.route("/<int:subject_id>", methods=["GET"])
@jwt_required()
def get_subject(subject_id):
    """Fetch a single subject (must belong to the current user).

    Includes a `weeks` breakdown grouping the subject's topics by week number,
    each topic flagged with the current user's `completed` status, so the
    syllabus detail page can render the saved plan.
    """
    user_id = get_jwt_identity()
    subject = Subject.query.filter_by(id=subject_id, user_id=user_id).first()
    if not subject:
        return jsonify({"error": "Subject not found."}), 404

    # Gather topics across the subject's syllabi and map completion status.
    topics = [t for syl in subject.syllabi for t in syl.topics]
    topic_ids = [t.id for t in topics]
    status_map = {}
    if topic_ids:
        records = Progress.query.filter(
            Progress.user_id == user_id, Progress.topic_id.in_(topic_ids)
        ).all()
        status_map = {r.topic_id: r.status for r in records}

    weeks_map = {}
    for t in topics:
        wk = t.week_number or 0
        weeks_map.setdefault(wk, []).append({
            "id": t.id,
            "title": t.title,
            "completed": status_map.get(t.id) == "completed",
        })
    weeks = [
        {"week": wk, "topics": weeks_map[wk]}
        for wk in sorted(weeks_map.keys())
    ]

    data = subject.to_dict()
    data["weeks"] = weeks
    return jsonify(data), 200


@subjects_bp.route("", methods=["POST"])
@jwt_required()
def create_subject():
    """Create a new subject for the current user."""
    user_id = get_jwt_identity()
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Subject name is required."}), 400

    subject = Subject(
        user_id=user_id,
        name=name,
        code=data.get("code"),
        semester=data.get("semester"),
        skill_level=data.get("skill_level"),
    )
    db.session.add(subject)
    db.session.commit()
    return jsonify({"message": "Subject created.", "subject": subject.to_dict()}), 201


@subjects_bp.route("/<int:subject_id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_subject(subject_id):
    """Update fields of an owned subject."""
    user_id = get_jwt_identity()
    subject = Subject.query.filter_by(id=subject_id, user_id=user_id).first()
    if not subject:
        return jsonify({"error": "Subject not found."}), 404

    data = request.get_json(silent=True) or {}
    for field in ["name", "code", "semester", "skill_level"]:
        if field in data:
            setattr(subject, field, data[field])

    db.session.commit()
    return jsonify({"message": "Subject updated.", "subject": subject.to_dict()}), 200


@subjects_bp.route("/<int:subject_id>", methods=["DELETE"])
@jwt_required()
def delete_subject(subject_id):
    """Delete an owned subject (and its syllabi/topics via cascade)."""
    user_id = get_jwt_identity()
    subject = Subject.query.filter_by(id=subject_id, user_id=user_id).first()
    if not subject:
        return jsonify({"error": "Subject not found."}), 404

    db.session.delete(subject)
    db.session.commit()
    return jsonify({"message": "Subject deleted."}), 200
