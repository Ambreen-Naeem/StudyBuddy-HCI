"""Progress tracking routes (/api/progress).

Tracks per-topic completion, computes percentages and weekly targets, and
maintains the user's study streak.
"""
from datetime import datetime, date, timedelta

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Subject, Syllabus, Topic, Progress, User

progress_bp = Blueprint("progress", __name__, url_prefix="/api/progress")

VALID_STATUSES = {"not_started", "in_progress", "completed"}


def _update_streak(user):
    """Increment study streak when the user makes progress on a new day.

    Simple heuristic suitable for a demo: if the user's last activity (based on
    the most recent completed_at) was yesterday, increment; if today already,
    keep; otherwise reset to 1.
    """
    today = date.today()
    last = (
        Progress.query.filter_by(user_id=user.id, status="completed")
        .order_by(Progress.completed_at.desc())
        .first()
    )
    if not last or not last.completed_at:
        user.study_streak = 1
        return

    last_day = last.completed_at.date()
    if last_day == today:
        # Already counted today; ensure streak is at least 1
        user.study_streak = max(user.study_streak or 0, 1)
    elif last_day == today - timedelta(days=1):
        user.study_streak = (user.study_streak or 0) + 1
    else:
        user.study_streak = 1


@progress_bp.route("", methods=["GET"])
@jwt_required()
def list_progress():
    """Return every subject for the current user with its topics and a real
    per-topic `completed` boolean derived from this user's Progress records.

    Shape: [ { id, name, weekly_target,
               topics: [ { id, week_number, title, completed } ] } ]
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    result = []
    for subject in user.subjects:
        # Gather all topics across the subject's syllabi
        topics = []
        total_weeks = 0
        for syl in subject.syllabi:
            topics.extend(syl.topics)
            total_weeks += syl.total_weeks or 0

        # Map topic_id -> status from this user's progress records
        topic_ids = [t.id for t in topics]
        status_map = {}
        if topic_ids:
            records = Progress.query.filter(
                Progress.user_id == user_id, Progress.topic_id.in_(topic_ids)
            ).all()
            status_map = {r.topic_id: r.status for r in records}

        # Weekly target: remaining topics spread over the weeks (>= 1)
        remaining = [t for t in topics if status_map.get(t.id) != "completed"]
        weeks = total_weeks if total_weeks > 0 else len(topics)
        weekly_target = round(len(remaining) / weeks, 1) if weeks else len(remaining)

        result.append({
            "id": subject.id,
            "name": subject.name,
            "weekly_target": weekly_target,
            "topics": [
                {
                    "id": t.id,
                    "week_number": t.week_number,
                    "title": t.title,
                    "completed": status_map.get(t.id) == "completed",
                }
                for t in topics
            ],
        })

    return jsonify(result), 200


@progress_bp.route("/topic/<int:topic_id>", methods=["POST", "PUT"])
@jwt_required()
def mark_topic(topic_id):
    """Set the current user's status for a topic.

    Body: { "status": "not_started" | "in_progress" | "completed" }
    """
    user_id = get_jwt_identity()
    topic = Topic.query.get(topic_id)
    if not topic:
        return jsonify({"error": "Topic not found."}), 404

    data = request.get_json(silent=True) or {}
    status = (data.get("status") or "").strip()
    if status not in VALID_STATUSES:
        return jsonify({
            "error": "Status must be one of: not_started, in_progress, completed."
        }), 400

    record = Progress.query.filter_by(user_id=user_id, topic_id=topic_id).first()
    if not record:
        record = Progress(user_id=user_id, topic_id=topic_id)
        db.session.add(record)

    record.status = status
    record.completed_at = datetime.utcnow() if status == "completed" else None

    # Update study streak when a topic is completed
    if status == "completed":
        user = User.query.get(user_id)
        _update_streak(user)

    db.session.commit()

    user = User.query.get(user_id)
    return jsonify({
        "message": "Progress updated.",
        "progress": record.to_dict(),
        "study_streak": user.study_streak,
    }), 200


@progress_bp.route("/subject/<int:subject_id>", methods=["GET"])
@jwt_required()
def subject_progress(subject_id):
    """Compute progress stats for a subject for the current user.

    Returns percentage complete, counts by status, weekly target, and the
    list of remaining (not yet completed) topics.
    """
    user_id = get_jwt_identity()
    subject = Subject.query.filter_by(id=subject_id, user_id=user_id).first()
    if not subject:
        return jsonify({"error": "Subject not found."}), 404

    # Gather all topics across the subject's syllabi
    topics = []
    total_weeks = 0
    for syl in subject.syllabi:
        topics.extend(syl.topics)
        total_weeks += syl.total_weeks or 0

    total = len(topics)
    if total == 0:
        return jsonify({
            "subject_id": subject_id,
            "total_topics": 0,
            "completed": 0,
            "in_progress": 0,
            "not_started": 0,
            "percentage": 0,
            "weekly_target": 0,
            "remaining_topics": [],
        }), 200

    # Map topic_id -> status from this user's progress records
    topic_ids = [t.id for t in topics]
    records = Progress.query.filter(
        Progress.user_id == user_id, Progress.topic_id.in_(topic_ids)
    ).all()
    status_map = {r.topic_id: r.status for r in records}

    completed = sum(1 for t in topics if status_map.get(t.id) == "completed")
    in_progress = sum(1 for t in topics if status_map.get(t.id) == "in_progress")
    not_started = total - completed - in_progress

    percentage = round((completed / total) * 100, 1)

    # Weekly target: remaining topics spread over remaining weeks (>=1)
    remaining = [t for t in topics if status_map.get(t.id) != "completed"]
    weeks = total_weeks if total_weeks > 0 else total
    weekly_target = round(len(remaining) / weeks, 1) if weeks else len(remaining)

    return jsonify({
        "subject_id": subject_id,
        "subject_name": subject.name,
        "total_topics": total,
        "completed": completed,
        "in_progress": in_progress,
        "not_started": not_started,
        "percentage": percentage,
        "weekly_target": weekly_target,
        "remaining_topics": [t.to_dict() for t in remaining],
    }), 200


@progress_bp.route("/me", methods=["GET"])
@jwt_required()
def my_progress():
    """Overall progress across all the user's subjects."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    total_topics = 0
    completed = 0
    per_subject = []

    for subject in user.subjects:
        s_topics = [t for syl in subject.syllabi for t in syl.topics]
        s_total = len(s_topics)
        if s_total == 0:
            per_subject.append({
                "subject_id": subject.id,
                "subject_name": subject.name,
                "total": 0, "completed": 0, "percentage": 0,
            })
            continue
        ids = [t.id for t in s_topics]
        recs = Progress.query.filter(
            Progress.user_id == user_id, Progress.topic_id.in_(ids),
            Progress.status == "completed",
        ).count()
        total_topics += s_total
        completed += recs
        per_subject.append({
            "subject_id": subject.id,
            "subject_name": subject.name,
            "total": s_total,
            "completed": recs,
            "percentage": round((recs / s_total) * 100, 1),
        })

    overall_pct = round((completed / total_topics) * 100, 1) if total_topics else 0
    return jsonify({
        "total_topics": total_topics,
        "completed": completed,
        "remaining": total_topics - completed,
        "overall_percentage": overall_pct,
        "study_streak": user.study_streak,
        "per_subject": per_subject,
    }), 200
