"""Demo data seeding for StudyBuddy.

`seed_demo_data()` populates the database with a couple of users, subjects,
study groups, a syllabus with weekly topics, some progress, tasks and
notifications so the API is immediately demoable. It is idempotent: if the
demo user already exists it does nothing.
"""
from datetime import datetime, timedelta

from extensions import db
from models import (
    User, Subject, StudyGroup, GroupMember, Syllabus, Topic, Progress,
    Task, Notification, DiscussionPost,
)


def seed_demo_data():
    """Seed the database with demo content (idempotent)."""
    # If demo user already exists, assume the DB is seeded.
    if User.query.filter_by(email="alice@university.edu").first():
        return False

    # --- Users -------------------------------------------------------------
    alice = User(
        name="Alice Johnson", email="alice@university.edu",
        university="State University", semester="Fall 2026",
        study_preferences="evenings, small groups",
        learning_style="visual", study_streak=4,
    )
    alice.set_password("password123")

    bob = User(
        name="Bob Smith", email="bob@university.edu",
        university="State University", semester="Fall 2026",
        study_preferences="mornings", learning_style="auditory",
        study_streak=2,
    )
    bob.set_password("password123")

    carol = User(
        name="Carol Lee", email="carol@university.edu",
        university="State University", semester="Fall 2026",
        study_preferences="library, focused", learning_style="kinesthetic",
        study_streak=0,
    )
    carol.set_password("password123")

    db.session.add_all([alice, bob, carol])
    db.session.flush()  # assign ids

    # --- Subjects (Alice's) ------------------------------------------------
    ds = Subject(
        user_id=alice.id, name="Data Structures", code="CS201",
        semester="Fall 2026", skill_level="intermediate",
    )
    algo = Subject(
        user_id=alice.id, name="Algorithms", code="CS202",
        semester="Fall 2026", skill_level="beginner",
    )
    # A subject for Bob so recommendations have variety
    bob_db = Subject(
        user_id=bob.id, name="Databases", code="CS301",
        semester="Fall 2026", skill_level="intermediate",
    )
    db.session.add_all([ds, algo, bob_db])
    db.session.flush()

    # --- Syllabus + weekly topics for Data Structures ----------------------
    syllabus = Syllabus(
        subject_id=ds.id, title="Data Structures - Core Syllabus",
        source="template", total_weeks=6,
    )
    db.session.add(syllabus)
    db.session.flush()

    topic_titles = [
        "Arrays and Strings",
        "Linked Lists",
        "Stacks and Queues",
        "Trees and BSTs",
        "Hash Tables",
        "Graphs and Traversal",
    ]
    topics = []
    for i, title in enumerate(topic_titles):
        t = Topic(
            syllabus_id=syllabus.id, week_number=i + 1, title=title,
            description=f"Week {i + 1}: {title}", order_index=i,
        )
        topics.append(t)
        db.session.add(t)
    db.session.flush()

    # --- Progress: Alice completed first two topics ------------------------
    db.session.add(Progress(
        user_id=alice.id, topic_id=topics[0].id, status="completed",
        completed_at=datetime.utcnow() - timedelta(days=1),
    ))
    db.session.add(Progress(
        user_id=alice.id, topic_id=topics[1].id, status="completed",
        completed_at=datetime.utcnow(),
    ))
    db.session.add(Progress(
        user_id=alice.id, topic_id=topics[2].id, status="in_progress",
    ))

    # --- Study groups ------------------------------------------------------
    g1 = StudyGroup(
        name="DS Study Squad", subject="Data Structures",
        description="Weekly practice for CS201.", admin_id=alice.id,
        skill_level="intermediate", semester="Fall 2026", max_members=8,
    )
    g2 = StudyGroup(
        name="Algo Beginners", subject="Algorithms",
        description="Friendly group for algorithm newcomers.", admin_id=bob.id,
        skill_level="beginner", semester="Fall 2026", max_members=10,
    )
    db.session.add_all([g1, g2])
    db.session.flush()

    # Memberships: Alice admins g1 (with Bob as member); Bob admins g2
    db.session.add_all([
        GroupMember(group_id=g1.id, user_id=alice.id, role="admin"),
        GroupMember(group_id=g1.id, user_id=bob.id, role="member"),
        GroupMember(group_id=g2.id, user_id=bob.id, role="admin"),
    ])
    db.session.flush()

    # --- Discussion posts in g1 -------------------------------------------
    post = DiscussionPost(
        group_id=g1.id, user_id=alice.id,
        content="Welcome everyone! Let's start with linked lists this week.",
    )
    db.session.add(post)
    db.session.flush()
    db.session.add(DiscussionPost(
        group_id=g1.id, user_id=bob.id,
        content="Sounds great, I'll bring some practice problems.",
        parent_id=post.id,
    ))

    # --- Tasks / deadlines for Alice --------------------------------------
    db.session.add_all([
        Task(
            user_id=alice.id, title="Finish Linked List assignment",
            description="Implement doubly linked list.",
            due_date=datetime.utcnow() + timedelta(days=2),
            type="deadline", status="pending", priority="high",
        ),
        Task(
            user_id=alice.id, title="Review Stacks notes",
            due_date=datetime.utcnow() + timedelta(days=4),
            type="task", status="pending", priority="med",
        ),
        Task(
            user_id=alice.id, title="Read Chapter 3",
            due_date=datetime.utcnow() - timedelta(days=1),
            type="task", status="done", priority="low",
        ),
    ])

    # --- Notifications for Alice ------------------------------------------
    db.session.add_all([
        Notification(
            user_id=alice.id, type="task_due",
            message="Assignment 'Linked List' is due in 2 days.",
            related_id=None, is_read=False,
        ),
        Notification(
            user_id=alice.id, type="group",
            message="Bob joined your group 'DS Study Squad'.",
            related_id=g1.id, is_read=True,
        ),
    ])

    db.session.commit()
    return True
