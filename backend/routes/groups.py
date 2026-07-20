"""Study group routes: CRUD, membership, join requests, matching (/api/groups)."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import StudyGroup, GroupMember, GroupJoinRequest, User, DiscussionPost
from routes.notifications import create_notification

groups_bp = Blueprint("groups", __name__, url_prefix="/api/groups")


# --- Helpers ---------------------------------------------------------------
def _is_admin(group, user_id):
    """True if user_id is the group admin."""
    return str(group.admin_id) == str(user_id)


def _is_member(group_id, user_id):
    return GroupMember.query.filter_by(group_id=group_id, user_id=user_id).first() is not None


# --- List / Create ---------------------------------------------------------
@groups_bp.route("", methods=["GET"])
@jwt_required()
def list_groups():
    """List all study groups. Optional filters: subject, semester, skill_level."""
    query = StudyGroup.query
    for field in ["subject", "semester", "skill_level"]:
        val = request.args.get(field)
        if val:
            query = query.filter(getattr(StudyGroup, field).ilike(f"%{val}%"))
    groups = query.order_by(StudyGroup.created_at.desc()).all()
    return jsonify([g.to_dict() for g in groups]), 200


@groups_bp.route("", methods=["POST"])
@jwt_required()
def create_group():
    """Create a group; the creator becomes admin and first member."""
    user_id = get_jwt_identity()
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Group name is required."}), 400

    group = StudyGroup(
        name=name,
        subject=data.get("subject"),
        description=data.get("description"),
        admin_id=user_id,
        skill_level=data.get("skill_level"),
        semester=data.get("semester"),
        max_members=data.get("max_members", 10),
    )
    db.session.add(group)
    db.session.flush()  # get group.id before commit

    # Creator joins as admin member
    db.session.add(GroupMember(group_id=group.id, user_id=user_id, role="admin"))
    db.session.commit()
    return jsonify({"message": "Group created.", "group": group.to_dict()}), 201


@groups_bp.route("/<int:group_id>", methods=["GET"])
@jwt_required()
def get_group(group_id):
    """Fetch one group with members, discussion posts, join requests and the
    current user's admin flag — everything the detail page renders.
    """
    user_id = get_jwt_identity()
    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found."}), 404

    is_admin = _is_admin(group, user_id)

    data = group.to_dict()
    data["is_admin"] = is_admin

    # Members, each with a flat name + is_admin flag the frontend expects.
    data["members"] = [
        {
            "id": m.id,
            "user_id": m.user_id,
            "name": m.user.name if m.user else None,
            "role": m.role,
            "is_admin": str(m.user_id) == str(group.admin_id),
        }
        for m in group.members
    ]

    # Top-level discussion posts with nested replies; expose `author` + content.
    top_posts = (
        DiscussionPost.query
        .filter_by(group_id=group_id, parent_id=None)
        .order_by(DiscussionPost.created_at.asc())
        .all()
    )

    def post_dict(p):
        return {
            "id": p.id,
            "author": p.user.name if p.user else None,
            "content": p.content,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "replies": [
                {
                    "id": r.id,
                    "author": r.user.name if r.user else None,
                    "content": r.content,
                    "created_at": r.created_at.isoformat() if r.created_at else None,
                }
                for r in p.replies
            ],
        }

    data["posts"] = [post_dict(p) for p in top_posts]

    # Pending join requests (admins act on them) with a flat name.
    if is_admin:
        pending = GroupJoinRequest.query.filter_by(
            group_id=group_id, status="pending"
        ).all()
        data["join_requests"] = [
            {
                "id": req.id,
                "user_id": req.user_id,
                "name": req.user.name if req.user else None,
            }
            for req in pending
        ]
    else:
        data["join_requests"] = []

    return jsonify(data), 200


@groups_bp.route("/<int:group_id>", methods=["DELETE"])
@jwt_required()
def delete_group(group_id):
    """Delete a group (admin only)."""
    user_id = get_jwt_identity()
    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found."}), 404
    if not _is_admin(group, user_id):
        return jsonify({"error": "Only the group admin can delete this group."}), 403

    db.session.delete(group)
    db.session.commit()
    return jsonify({"message": "Group deleted."}), 200


# --- Members ---------------------------------------------------------------
@groups_bp.route("/<int:group_id>/members", methods=["GET"])
@jwt_required()
def list_members(group_id):
    """List members of a group."""
    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found."}), 404
    return jsonify([m.to_dict() for m in group.members]), 200


@groups_bp.route("/<int:group_id>/members", methods=["POST"])
@jwt_required()
def add_member(group_id):
    """Admin directly adds a member by user_id."""
    user_id = get_jwt_identity()
    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found."}), 404
    if not _is_admin(group, user_id):
        return jsonify({"error": "Only the group admin can add members."}), 403

    data = request.get_json(silent=True) or {}
    new_user_id = data.get("user_id")
    if not new_user_id:
        return jsonify({"error": "user_id is required."}), 400
    if not User.query.get(new_user_id):
        return jsonify({"error": "User not found."}), 404
    if _is_member(group_id, new_user_id):
        return jsonify({"error": "User is already a member."}), 409
    if group.member_count() >= group.max_members:
        return jsonify({"error": "Group is already full."}), 409

    db.session.add(GroupMember(group_id=group_id, user_id=new_user_id, role="member"))
    create_notification(new_user_id, "group", f"You were added to '{group.name}'.", group_id)
    db.session.commit()
    return jsonify({"message": "Member added."}), 201


@groups_bp.route("/<int:group_id>/members/<int:member_user_id>", methods=["DELETE"])
@jwt_required()
def remove_member(group_id, member_user_id):
    """Admin removes a member (cannot remove the admin)."""
    user_id = get_jwt_identity()
    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found."}), 404
    if not _is_admin(group, user_id):
        return jsonify({"error": "Only the group admin can remove members."}), 403
    if str(member_user_id) == str(group.admin_id):
        return jsonify({"error": "The admin cannot be removed from the group."}), 400

    member = GroupMember.query.filter_by(group_id=group_id, user_id=member_user_id).first()
    if not member:
        return jsonify({"error": "Member not found."}), 404

    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Member removed."}), 200


@groups_bp.route("/<int:group_id>/leave", methods=["POST"])
@jwt_required()
def leave_group(group_id):
    """Current user leaves the group. Admin must delete or transfer instead."""
    user_id = get_jwt_identity()
    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found."}), 404
    if _is_admin(group, user_id):
        return jsonify({"error": "Admin cannot leave; delete the group instead."}), 400

    member = GroupMember.query.filter_by(group_id=group_id, user_id=user_id).first()
    if not member:
        return jsonify({"error": "You are not a member of this group."}), 404

    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "You left the group."}), 200


# --- Join requests ---------------------------------------------------------
@groups_bp.route("/<int:group_id>/join", methods=["POST"])
@jwt_required()
def request_join(group_id):
    """Send a join request to a group."""
    user_id = get_jwt_identity()
    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found."}), 404
    if _is_member(group_id, user_id):
        return jsonify({"error": "You are already a member of this group."}), 409
    if group.member_count() >= group.max_members:
        return jsonify({"error": "Group is already full."}), 409

    existing = GroupJoinRequest.query.filter_by(
        group_id=group_id, user_id=user_id, status="pending"
    ).first()
    if existing:
        return jsonify({"error": "You already have a pending request for this group."}), 409

    req = GroupJoinRequest(group_id=group_id, user_id=user_id, status="pending")
    db.session.add(req)

    # Notify the admin
    requester = User.query.get(user_id)
    create_notification(
        group.admin_id, "join_request",
        f"{requester.name} requested to join '{group.name}'.", group_id,
    )
    db.session.commit()
    return jsonify({"message": "Join request sent.", "request": req.to_dict()}), 201


@groups_bp.route("/<int:group_id>/requests", methods=["GET"])
@jwt_required()
def list_join_requests(group_id):
    """Admin lists pending join requests for a group."""
    user_id = get_jwt_identity()
    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found."}), 404
    if not _is_admin(group, user_id):
        return jsonify({"error": "Only the group admin can view join requests."}), 403

    reqs = GroupJoinRequest.query.filter_by(group_id=group_id, status="pending").all()
    return jsonify([r.to_dict() for r in reqs]), 200


@groups_bp.route("/requests/<int:request_id>/accept", methods=["POST"])
@jwt_required()
def accept_request(request_id):
    """Admin accepts a join request -> creates membership."""
    user_id = get_jwt_identity()
    req = GroupJoinRequest.query.get(request_id)
    if not req:
        return jsonify({"error": "Join request not found."}), 404

    group = StudyGroup.query.get(req.group_id)
    if not _is_admin(group, user_id):
        return jsonify({"error": "Only the group admin can accept requests."}), 403
    if req.status != "pending":
        return jsonify({"error": f"Request already {req.status}."}), 409
    if group.member_count() >= group.max_members:
        return jsonify({"error": "Group is already full."}), 409

    req.status = "accepted"
    db.session.add(GroupMember(group_id=req.group_id, user_id=req.user_id, role="member"))
    create_notification(
        req.user_id, "group", f"Your request to join '{group.name}' was accepted.", group.id,
    )
    db.session.commit()
    return jsonify({"message": "Request accepted."}), 200


@groups_bp.route("/requests/<int:request_id>/reject", methods=["POST"])
@jwt_required()
def reject_request(request_id):
    """Admin rejects a join request."""
    user_id = get_jwt_identity()
    req = GroupJoinRequest.query.get(request_id)
    if not req:
        return jsonify({"error": "Join request not found."}), 404

    group = StudyGroup.query.get(req.group_id)
    if not _is_admin(group, user_id):
        return jsonify({"error": "Only the group admin can reject requests."}), 403
    if req.status != "pending":
        return jsonify({"error": f"Request already {req.status}."}), 409

    req.status = "rejected"
    create_notification(
        req.user_id, "group", f"Your request to join '{group.name}' was rejected.", group.id,
    )
    db.session.commit()
    return jsonify({"message": "Request rejected."}), 200


# --- Matching & recommendations -------------------------------------------
@groups_bp.route("/match", methods=["GET"])
@jwt_required()
def match_groups():
    """Find groups matching subject / semester / skill level.

    Query params (all optional): subject, semester, skill_level.
    Each match is scored; results are returned highest-score first.
    """
    user_id = get_jwt_identity()
    subject = request.args.get("subject")
    semester = request.args.get("semester")
    skill_level = request.args.get("skill_level")

    groups = StudyGroup.query.all()
    results = []
    for g in groups:
        # Skip groups the user is already in
        if _is_member(g.id, user_id):
            continue
        score = 0
        if subject and g.subject and subject.lower() in g.subject.lower():
            score += 3
        if semester and g.semester and semester.lower() == g.semester.lower():
            score += 2
        if skill_level and g.skill_level and skill_level.lower() == g.skill_level.lower():
            score += 1
        # Only include groups with at least one matching attribute when filters given
        if (subject or semester or skill_level) and score == 0:
            continue
        data = g.to_dict()
        data["match_score"] = score
        results.append(data)

    results.sort(key=lambda d: d["match_score"], reverse=True)
    return jsonify(results), 200


@groups_bp.route("/recommended", methods=["GET"])
@jwt_required()
def recommended_groups():
    """Recommend groups based on the current user's subjects & profile.

    Matches the user's own subjects/semester/skill against existing groups.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    # Build the set of subject names the user studies
    subject_names = {s.name.lower() for s in user.subjects}
    skill_levels = {s.skill_level.lower() for s in user.subjects if s.skill_level}

    groups = StudyGroup.query.all()
    results = []
    for g in groups:
        if _is_member(g.id, user_id):
            continue
        score = 0
        if g.subject and g.subject.lower() in subject_names:
            score += 3
        if user.semester and g.semester and user.semester.lower() == g.semester.lower():
            score += 2
        if g.skill_level and g.skill_level.lower() in skill_levels:
            score += 1
        if score > 0:
            data = g.to_dict()
            data["match_score"] = score
            results.append(data)

    results.sort(key=lambda d: d["match_score"], reverse=True)
    return jsonify(results), 200
