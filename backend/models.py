"""SQLAlchemy models for StudyBuddy.

Every model exposes a `to_dict()` helper so route handlers can return clean
JSON without leaking sensitive fields (e.g. password hashes).
"""
from datetime import datetime

from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    university = db.Column(db.String(160))
    semester = db.Column(db.String(40))
    study_preferences = db.Column(db.Text)            # free text / comma list
    availability_schedule = db.Column(db.Text)        # JSON-encoded string
    learning_style = db.Column(db.String(60))         # visual / auditory / ...
    study_streak = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    subjects = db.relationship("Subject", backref="user", cascade="all, delete-orphan")
    tasks = db.relationship("Task", backref="user", cascade="all, delete-orphan")
    notifications = db.relationship("Notification", backref="user", cascade="all, delete-orphan")
    progress = db.relationship("Progress", backref="user", cascade="all, delete-orphan")

    # --- Password helpers ---
    def set_password(self, password):
        """Hash and store a plaintext password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify a plaintext password against the stored hash."""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Serialise user, deliberately excluding the password hash."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "university": self.university,
            "semester": self.semester,
            "study_preferences": self.study_preferences,
            "availability_schedule": self.availability_schedule,
            "learning_style": self.learning_style,
            "study_streak": self.study_streak,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ---------------------------------------------------------------------------
# Subject
# ---------------------------------------------------------------------------
class Subject(db.Model):
    __tablename__ = "subjects"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(160), nullable=False)
    code = db.Column(db.String(40))
    semester = db.Column(db.String(40))
    skill_level = db.Column(db.String(40))  # beginner / intermediate / advanced
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    syllabi = db.relationship("Syllabus", backref="subject", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "code": self.code,
            "semester": self.semester,
            "skill_level": self.skill_level,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ---------------------------------------------------------------------------
# StudyGroup
# ---------------------------------------------------------------------------
class StudyGroup(db.Model):
    __tablename__ = "study_groups"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False)
    subject = db.Column(db.String(160))
    description = db.Column(db.Text)
    admin_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    skill_level = db.Column(db.String(40))
    semester = db.Column(db.String(40))
    max_members = db.Column(db.Integer, default=10)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    admin = db.relationship("User", foreign_keys=[admin_id])
    members = db.relationship("GroupMember", backref="group", cascade="all, delete-orphan")
    join_requests = db.relationship("GroupJoinRequest", backref="group", cascade="all, delete-orphan")
    posts = db.relationship("DiscussionPost", backref="group", cascade="all, delete-orphan")

    def member_count(self):
        return GroupMember.query.filter_by(group_id=self.id).count()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "subject": self.subject,
            "description": self.description,
            "admin_id": self.admin_id,
            "admin_name": self.admin.name if self.admin else None,
            "skill_level": self.skill_level,
            "semester": self.semester,
            "max_members": self.max_members,
            "member_count": self.member_count(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ---------------------------------------------------------------------------
# GroupMember
# ---------------------------------------------------------------------------
class GroupMember(db.Model):
    __tablename__ = "group_members"

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey("study_groups.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    role = db.Column(db.String(20), default="member")  # member / admin
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User")

    def to_dict(self):
        return {
            "id": self.id,
            "group_id": self.group_id,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else None,
            "role": self.role,
            "joined_at": self.joined_at.isoformat() if self.joined_at else None,
        }


# ---------------------------------------------------------------------------
# GroupJoinRequest
# ---------------------------------------------------------------------------
class GroupJoinRequest(db.Model):
    __tablename__ = "group_join_requests"

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey("study_groups.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    status = db.Column(db.String(20), default="pending")  # pending / accepted / rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User")

    def to_dict(self):
        return {
            "id": self.id,
            "group_id": self.group_id,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else None,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ---------------------------------------------------------------------------
# Syllabus
# ---------------------------------------------------------------------------
class Syllabus(db.Model):
    __tablename__ = "syllabi"

    id = db.Column(db.Integer, primary_key=True)
    subject_id = db.Column(db.Integer, db.ForeignKey("subjects.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    total_weeks = db.Column(db.Integer, default=0)
    source = db.Column(db.String(120))  # manual / uploaded / template
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    topics = db.relationship(
        "Topic", backref="syllabus", cascade="all, delete-orphan",
        order_by="Topic.order_index",
    )

    def to_dict(self, include_topics=False):
        data = {
            "id": self.id,
            "subject_id": self.subject_id,
            "title": self.title,
            "total_weeks": self.total_weeks,
            "source": self.source,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_topics:
            data["topics"] = [t.to_dict() for t in self.topics]
        return data


# ---------------------------------------------------------------------------
# Topic
# ---------------------------------------------------------------------------
class Topic(db.Model):
    __tablename__ = "topics"

    id = db.Column(db.Integer, primary_key=True)
    syllabus_id = db.Column(db.Integer, db.ForeignKey("syllabi.id"), nullable=False)
    week_number = db.Column(db.Integer)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    order_index = db.Column(db.Integer, default=0)

    progress_records = db.relationship("Progress", backref="topic", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "syllabus_id": self.syllabus_id,
            "week_number": self.week_number,
            "title": self.title,
            "description": self.description,
            "order_index": self.order_index,
        }


# ---------------------------------------------------------------------------
# Progress
# ---------------------------------------------------------------------------
class Progress(db.Model):
    __tablename__ = "progress"
    __table_args__ = (
        db.UniqueConstraint("user_id", "topic_id", name="uq_user_topic"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey("topics.id"), nullable=False)
    status = db.Column(db.String(20), default="not_started")  # not_started / in_progress / completed
    completed_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "topic_id": self.topic_id,
            "status": self.status,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }


# ---------------------------------------------------------------------------
# Task / Deadline
# ---------------------------------------------------------------------------
class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime)
    type = db.Column(db.String(20), default="task")      # task / deadline
    status = db.Column(db.String(20), default="pending")  # pending / done
    priority = db.Column(db.String(20), default="med")    # low / med / high
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "type": self.type,
            "status": self.status,
            "priority": self.priority,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ---------------------------------------------------------------------------
# Notification
# ---------------------------------------------------------------------------
class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    type = db.Column(db.String(60))           # join_request / task_due / group / ...
    message = db.Column(db.Text)
    related_id = db.Column(db.Integer)         # id of related entity (group, task...)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "type": self.type,
            "message": self.message,
            "related_id": self.related_id,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ---------------------------------------------------------------------------
# DiscussionPost (threaded via parent_id)
# ---------------------------------------------------------------------------
class DiscussionPost(db.Model):
    __tablename__ = "discussion_posts"

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey("study_groups.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("discussion_posts.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User")
    replies = db.relationship(
        "DiscussionPost",
        backref=db.backref("parent", remote_side=[id]),
        cascade="all, delete-orphan",
    )

    def to_dict(self, include_replies=False):
        data = {
            "id": self.id,
            "group_id": self.group_id,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else None,
            "content": self.content,
            "parent_id": self.parent_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_replies:
            data["replies"] = [r.to_dict() for r in self.replies]
        return data
