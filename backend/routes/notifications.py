"""Notification routes plus an internal helper (/api/notifications)."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Notification

notifications_bp = Blueprint("notifications", __name__, url_prefix="/api/notifications")


# ---------------------------------------------------------------------------
# Internal helper - importable by other route modules to push notifications.
# ---------------------------------------------------------------------------
def create_notification(user_id, ntype, message, related_id=None):
    """Create and persist a notification for a user.

    Intended to be called from other blueprints (e.g. when a join request is
    sent). Returns the created Notification instance.
    """
    note = Notification(
        user_id=user_id,
        type=ntype,
        message=message,
        related_id=related_id,
    )
    db.session.add(note)
    db.session.commit()
    return note


@notifications_bp.route("", methods=["GET"])
@jwt_required()
def list_notifications():
    """List notifications for the current user (newest first).

    Optional query param `unread=true` filters to unread only.
    """
    user_id = get_jwt_identity()
    query = Notification.query.filter_by(user_id=user_id)

    if request.args.get("unread", "").lower() == "true":
        query = query.filter_by(is_read=False)

    notes = query.order_by(Notification.created_at.desc()).all()
    return jsonify({
        "notifications": [n.to_dict() for n in notes],
        "unread_count": Notification.query.filter_by(user_id=user_id, is_read=False).count(),
    }), 200


@notifications_bp.route("/<int:note_id>/read", methods=["PUT", "PATCH"])
@jwt_required()
def mark_read(note_id):
    """Mark a single notification as read."""
    user_id = get_jwt_identity()
    note = Notification.query.filter_by(id=note_id, user_id=user_id).first()
    if not note:
        return jsonify({"error": "Notification not found."}), 404

    note.is_read = True
    db.session.commit()
    return jsonify({"message": "Notification marked as read.", "notification": note.to_dict()}), 200


@notifications_bp.route("/read-all", methods=["PUT", "PATCH"])
@jwt_required()
def mark_all_read():
    """Mark every notification for the current user as read."""
    user_id = get_jwt_identity()
    Notification.query.filter_by(user_id=user_id, is_read=False).update({"is_read": True})
    db.session.commit()
    return jsonify({"message": "All notifications marked as read."}), 200


@notifications_bp.route("/<int:note_id>", methods=["DELETE"])
@jwt_required()
def delete_notification(note_id):
    """Delete a notification."""
    user_id = get_jwt_identity()
    note = Notification.query.filter_by(id=note_id, user_id=user_id).first()
    if not note:
        return jsonify({"error": "Notification not found."}), 404

    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Notification deleted."}), 200
