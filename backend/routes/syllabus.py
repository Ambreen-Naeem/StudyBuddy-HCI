"""Syllabus & topic routes (/api/syllabus, nested under subjects)."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Subject, Syllabus, Topic

syllabus_bp = Blueprint("syllabus", __name__, url_prefix="/api")


def _owned_subject(subject_id, user_id):
    return Subject.query.filter_by(id=subject_id, user_id=user_id).first()


def _owned_syllabus(syllabus_id, user_id):
    """Return a syllabus only if its subject belongs to the user."""
    syl = Syllabus.query.get(syllabus_id)
    if not syl:
        return None
    if str(syl.subject.user_id) != str(user_id):
        return None
    return syl


# --- Create syllabus & auto-generate weekly topics -------------------------
@syllabus_bp.route("/subjects/<int:subject_id>/syllabus", methods=["POST"])
@jwt_required()
def create_syllabus(subject_id):
    """Create a syllabus for a subject and auto-generate weekly topics.

    Body:
        title (str, required)
        source (str, optional)
        topics (list[str], optional): topic titles, one per week.
            Week numbers are assigned sequentially starting at Week 1.
    """
    user_id = get_jwt_identity()
    subject = _owned_subject(subject_id, user_id)
    if not subject:
        return jsonify({"error": "Subject not found."}), 404

    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Syllabus title is required."}), 400

    topic_titles = data.get("topics") or []
    if not isinstance(topic_titles, list):
        return jsonify({"error": "'topics' must be a list of topic titles."}), 400

    syllabus = Syllabus(
        subject_id=subject_id,
        title=title,
        source=data.get("source", "manual"),
        total_weeks=len(topic_titles),
    )
    db.session.add(syllabus)
    db.session.flush()  # need syllabus.id for topics

    # Auto-generate one topic per week (Week 1..N)
    for index, t in enumerate(topic_titles):
        # Each item may be a plain string or a dict with title/description
        if isinstance(t, dict):
            t_title = (t.get("title") or "").strip()
            t_desc = t.get("description")
        else:
            t_title = str(t).strip()
            t_desc = None
        if not t_title:
            continue
        db.session.add(Topic(
            syllabus_id=syllabus.id,
            week_number=index + 1,
            title=t_title,
            description=t_desc,
            order_index=index,
        ))

    db.session.commit()
    return jsonify({
        "message": "Syllabus created.",
        "syllabus": syllabus.to_dict(include_topics=True),
    }), 201


@syllabus_bp.route("/subjects/<int:subject_id>/syllabus", methods=["GET"])
@jwt_required()
def list_subject_syllabi(subject_id):
    """List syllabi (with topics) for a subject."""
    user_id = get_jwt_identity()
    subject = _owned_subject(subject_id, user_id)
    if not subject:
        return jsonify({"error": "Subject not found."}), 404
    return jsonify([s.to_dict(include_topics=True) for s in subject.syllabi]), 200


@syllabus_bp.route("/syllabus/<int:syllabus_id>", methods=["GET"])
@jwt_required()
def get_syllabus(syllabus_id):
    """Fetch one syllabus with its topics."""
    user_id = get_jwt_identity()
    syl = _owned_syllabus(syllabus_id, user_id)
    if not syl:
        return jsonify({"error": "Syllabus not found."}), 404
    return jsonify(syl.to_dict(include_topics=True)), 200


@syllabus_bp.route("/syllabus/<int:syllabus_id>", methods=["DELETE"])
@jwt_required()
def delete_syllabus(syllabus_id):
    """Delete a syllabus (and its topics)."""
    user_id = get_jwt_identity()
    syl = _owned_syllabus(syllabus_id, user_id)
    if not syl:
        return jsonify({"error": "Syllabus not found."}), 404
    db.session.delete(syl)
    db.session.commit()
    return jsonify({"message": "Syllabus deleted."}), 200


# --- Topics ----------------------------------------------------------------
@syllabus_bp.route("/syllabus/<int:syllabus_id>/topics", methods=["GET"])
@jwt_required()
def list_topics(syllabus_id):
    """List topics for a syllabus, ordered by week."""
    user_id = get_jwt_identity()
    syl = _owned_syllabus(syllabus_id, user_id)
    if not syl:
        return jsonify({"error": "Syllabus not found."}), 404
    return jsonify([t.to_dict() for t in syl.topics]), 200


@syllabus_bp.route("/syllabus/<int:syllabus_id>/topics", methods=["POST"])
@jwt_required()
def add_topic(syllabus_id):
    """Add a single topic to a syllabus."""
    user_id = get_jwt_identity()
    syl = _owned_syllabus(syllabus_id, user_id)
    if not syl:
        return jsonify({"error": "Syllabus not found."}), 404

    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Topic title is required."}), 400

    # Default week/order to next available slot
    next_index = len(syl.topics)
    topic = Topic(
        syllabus_id=syllabus_id,
        week_number=data.get("week_number", next_index + 1),
        title=title,
        description=data.get("description"),
        order_index=data.get("order_index", next_index),
    )
    db.session.add(topic)
    syl.total_weeks = max(syl.total_weeks or 0, topic.week_number or 0)
    db.session.commit()
    return jsonify({"message": "Topic added.", "topic": topic.to_dict()}), 201


@syllabus_bp.route("/topics/<int:topic_id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_topic(topic_id):
    """Update a topic's fields."""
    user_id = get_jwt_identity()
    topic = Topic.query.get(topic_id)
    if not topic or str(topic.syllabus.subject.user_id) != str(user_id):
        return jsonify({"error": "Topic not found."}), 404

    data = request.get_json(silent=True) or {}
    for field in ["week_number", "title", "description", "order_index"]:
        if field in data:
            setattr(topic, field, data[field])
    db.session.commit()
    return jsonify({"message": "Topic updated.", "topic": topic.to_dict()}), 200


@syllabus_bp.route("/topics/<int:topic_id>", methods=["DELETE"])
@jwt_required()
def delete_topic(topic_id):
    """Delete a topic."""
    user_id = get_jwt_identity()
    topic = Topic.query.get(topic_id)
    if not topic or str(topic.syllabus.subject.user_id) != str(user_id):
        return jsonify({"error": "Topic not found."}), 404
    db.session.delete(topic)
    db.session.commit()
    return jsonify({"message": "Topic deleted."}), 200
