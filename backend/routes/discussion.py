"""Group discussion board routes (/api/groups/<id>/posts).

Supports threaded discussion: top-level posts plus replies via parent_id.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import StudyGroup, GroupMember, DiscussionPost

discussion_bp = Blueprint("discussion", __name__, url_prefix="/api/groups")


def _is_member(group_id, user_id):
    return GroupMember.query.filter_by(group_id=group_id, user_id=user_id).first() is not None


@discussion_bp.route("/<int:group_id>/posts", methods=["GET"])
@jwt_required()
def list_posts(group_id):
    """List top-level posts for a group with their nested replies.

    Only group members can view the discussion board.
    """
    user_id = get_jwt_identity()
    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found."}), 404
    if not _is_member(group_id, user_id):
        return jsonify({"error": "Only group members can view the discussion."}), 403

    # Top-level posts only; replies are nested via to_dict(include_replies=True)
    top_posts = (
        DiscussionPost.query
        .filter_by(group_id=group_id, parent_id=None)
        .order_by(DiscussionPost.created_at.asc())
        .all()
    )
    return jsonify([p.to_dict(include_replies=True) for p in top_posts]), 200


@discussion_bp.route("/<int:group_id>/posts", methods=["POST"])
@jwt_required()
def create_post(group_id):
    """Create a post or a reply (when parent_id is given) in a group."""
    user_id = get_jwt_identity()
    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found."}), 404
    if not _is_member(group_id, user_id):
        return jsonify({"error": "Only group members can post."}), 403

    data = request.get_json(silent=True) or {}
    content = (data.get("content") or "").strip()
    if not content:
        return jsonify({"error": "Post content cannot be empty."}), 400

    parent_id = data.get("parent_id")
    if parent_id is not None:
        parent = DiscussionPost.query.get(parent_id)
        if not parent or parent.group_id != group_id:
            return jsonify({"error": "Parent post not found in this group."}), 404

    post = DiscussionPost(
        group_id=group_id,
        user_id=user_id,
        content=content,
        parent_id=parent_id,
    )
    db.session.add(post)
    db.session.commit()
    return jsonify({"message": "Post created.", "post": post.to_dict()}), 201


@discussion_bp.route("/posts/<int:post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):
    """Delete a post. Allowed for the author or the group admin."""
    user_id = get_jwt_identity()
    post = DiscussionPost.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found."}), 404

    group = StudyGroup.query.get(post.group_id)
    is_author = str(post.user_id) == str(user_id)
    is_admin = group and str(group.admin_id) == str(user_id)
    if not (is_author or is_admin):
        return jsonify({"error": "You can only delete your own posts."}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted."}), 200
