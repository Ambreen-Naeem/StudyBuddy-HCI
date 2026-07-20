"""Dashboard aggregation route (/api/dashboard).

Combines data from across the app into a single payload the frontend can use
to render the home dashboard.
"""
from datetime import datetime

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import (
    User, Subject, Topic, Progress, Task, GroupMember, StudyGroup,
    DiscussionPost,
)

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api")


@dashboard_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    """Return aggregated dashboard statistics for the current user."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    # --- Subjects & topics ---
    subjects = user.subjects
    total_subjects = len(subjects)

    all_topic_ids = [
        t.id for s in subjects for syl in s.syllabi for t in syl.topics
    ]
    total_topics = len(all_topic_ids)

    completed_topics = 0
    if all_topic_ids:
        completed_topics = Progress.query.filter(
            Progress.user_id == user_id,
            Progress.topic_id.in_(all_topic_ids),
            Progress.status == "completed",
        ).count()
    remaining_topics = total_topics - completed_topics
    progress_pct = round((completed_topics / total_topics) * 100, 1) if total_topics else 0

    # --- Upcoming tasks (pending, soonest first) ---
    upcoming = (
        Task.query.filter_by(user_id=user_id, status="pending")
        .order_by(Task.due_date.asc().nullslast())
        .limit(5)
        .all()
    )

    # --- Group activity ---
    memberships = GroupMember.query.filter_by(user_id=user_id).all()
    group_ids = [m.group_id for m in memberships]
    my_groups = StudyGroup.query.filter(StudyGroup.id.in_(group_ids)).all() if group_ids else []
    recent_posts = []
    if group_ids:
        recent_posts = (
            DiscussionPost.query.filter(DiscussionPost.group_id.in_(group_ids))
            .order_by(DiscussionPost.created_at.desc())
            .limit(5)
            .all()
        )

    # --- Recommended groups (subject/semester/skill match, not already in) ---
    subject_names = {s.name.lower() for s in subjects}
    skill_levels = {s.skill_level.lower() for s in subjects if s.skill_level}
    recommended = []
    for g in StudyGroup.query.all():
        if g.id in group_ids:
            continue
        score = 0
        if g.subject and g.subject.lower() in subject_names:
            score += 3
        if user.semester and g.semester and user.semester.lower() == g.semester.lower():
            score += 2
        if g.skill_level and g.skill_level.lower() in skill_levels:
            score += 1
        if score > 0:
            d = g.to_dict()
            d["match_score"] = score
            recommended.append(d)
    recommended.sort(key=lambda d: d["match_score"], reverse=True)
    recommended = recommended[:5]

    # --- Study hours (derived/mocked from completed topics: ~2h per topic) ---
    estimated_study_hours = completed_topics * 2

    return jsonify({
        "user": {
            "id": user.id,
            "name": user.name,
            "study_streak": user.study_streak,
        },
        "stats": {
            "total_subjects": total_subjects,
            "total_topics": total_topics,
            "topics_completed": completed_topics,
            "topics_remaining": remaining_topics,
            "progress_percentage": progress_pct,
            "study_streak": user.study_streak,
            "estimated_study_hours": estimated_study_hours,
            "groups_joined": len(my_groups),
        },
        "upcoming_tasks": [t.to_dict() for t in upcoming],
        "my_groups": [g.to_dict() for g in my_groups],
        "group_activity": [p.to_dict() for p in recent_posts],
        "recommended_groups": recommended,
        "generated_at": datetime.utcnow().isoformat(),
    }), 200
