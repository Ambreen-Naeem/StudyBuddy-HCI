# StudyBuddy — Flask REST API Backend

Backend for **StudyBuddy**, a university study-companion app. Built with Flask,
Flask-SQLAlchemy, Flask-JWT-Extended, Flask-CORS and SQLite using the
application-factory + Blueprints pattern.

## Features

- JWT authentication (register / login / profile)
- Subjects, syllabi with auto-generated weekly topics
- Progress tracking with percentages, weekly targets and study streaks
- Study groups: matching, recommendations, join requests, membership & admin controls
- Threaded group discussion board
- Task / deadline planner with week & month filters
- Notifications
- Aggregated dashboard endpoint
- Demo data seeded automatically on first run

## Setup (Windows PowerShell)

```powershell
# 1. Move into the backend folder
cd "E:\HCI project\backend"

# 2. Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1
# If activation is blocked by execution policy, run once:
#   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the server (creates + seeds studybuddy.db on first run)
python app.py
```

The API will be available at `http://localhost:5000`.

### Alternative: Flask CLI

```powershell
flask --app app init-db   # create tables + seed demo data
flask --app app run
```

## Demo accounts

| Email                   | Password      |
|-------------------------|---------------|
| alice@university.edu    | password123   |
| bob@university.edu      | password123   |
| carol@university.edu    | password123   |

## Authentication

All protected endpoints require an `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain a token from `/api/auth/login` or `/api/auth/register`.

Example login (PowerShell):

```powershell
$body = @{ email = "alice@university.edu"; password = "password123" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -Body $body -ContentType "application/json"
```

## Endpoints

### Health
| Method | Path           | Description           |
|--------|----------------|-----------------------|
| GET    | `/api/health`  | Service health check  |

### Auth (`/api/auth`)
| Method     | Path                | Description                  |
|------------|---------------------|------------------------------|
| POST       | `/api/auth/register`| Register, returns JWT        |
| POST       | `/api/auth/login`   | Login, returns JWT           |
| POST       | `/api/auth/logout`  | Logout (discard token)       |
| GET        | `/api/auth/me`      | Current user profile         |
| PUT/PATCH  | `/api/auth/me`      | Update current user profile  |

### Subjects (`/api/subjects`)
| Method     | Path                      | Description        |
|------------|---------------------------|--------------------|
| GET        | `/api/subjects`           | List subjects      |
| POST       | `/api/subjects`           | Create subject     |
| GET        | `/api/subjects/<id>`      | Get subject        |
| PUT/PATCH  | `/api/subjects/<id>`      | Update subject     |
| DELETE     | `/api/subjects/<id>`      | Delete subject     |

### Syllabus & Topics
| Method     | Path                                       | Description                          |
|------------|--------------------------------------------|--------------------------------------|
| POST       | `/api/subjects/<id>/syllabus`              | Create syllabus + auto-gen topics    |
| GET        | `/api/subjects/<id>/syllabus`              | List syllabi for a subject           |
| GET        | `/api/syllabus/<id>`                        | Get syllabus with topics             |
| DELETE     | `/api/syllabus/<id>`                        | Delete syllabus                      |
| GET        | `/api/syllabus/<id>/topics`                | List topics                          |
| POST       | `/api/syllabus/<id>/topics`                | Add a topic                          |
| PUT/PATCH  | `/api/topics/<id>`                         | Update a topic                       |
| DELETE     | `/api/topics/<id>`                         | Delete a topic                       |

### Progress (`/api/progress`)
| Method     | Path                            | Description                              |
|------------|---------------------------------|------------------------------------------|
| POST/PUT   | `/api/progress/topic/<id>`      | Set topic status, update streak          |
| GET        | `/api/progress/subject/<id>`    | Per-subject stats + remaining topics     |
| GET        | `/api/progress/me`              | Overall progress across all subjects     |

### Tasks (`/api/tasks`)
| Method     | Path               | Description                                   |
|------------|--------------------|-----------------------------------------------|
| GET        | `/api/tasks`       | List tasks (filters: status, type, priority, `week=YYYY-WW`, `month=YYYY-MM`) |
| POST       | `/api/tasks`       | Create task / deadline                        |
| GET        | `/api/tasks/<id>`  | Get a task                                    |
| PUT/PATCH  | `/api/tasks/<id>`  | Update a task                                 |
| DELETE     | `/api/tasks/<id>`  | Delete a task                                 |

### Groups (`/api/groups`)
| Method | Path                                         | Description                            |
|--------|----------------------------------------------|----------------------------------------|
| GET    | `/api/groups`                                | List groups (filters: subject, semester, skill_level) |
| POST   | `/api/groups`                                | Create group (creator = admin)         |
| GET    | `/api/groups/<id>`                           | Get group with members                 |
| DELETE | `/api/groups/<id>`                           | Delete group (admin)                   |
| GET    | `/api/groups/match`                          | Match groups by subject/semester/skill |
| GET    | `/api/groups/recommended`                    | Recommended groups for current user    |
| GET    | `/api/groups/<id>/members`                   | List members                           |
| POST   | `/api/groups/<id>/members`                   | Add member (admin)                     |
| DELETE | `/api/groups/<id>/members/<user_id>`         | Remove member (admin)                  |
| POST   | `/api/groups/<id>/leave`                     | Leave group                            |
| POST   | `/api/groups/<id>/join`                       | Send join request                      |
| GET    | `/api/groups/<id>/requests`                  | List pending requests (admin)          |
| POST   | `/api/groups/requests/<id>/accept`           | Accept join request (admin)            |
| POST   | `/api/groups/requests/<id>/reject`           | Reject join request (admin)            |

### Discussion (`/api/groups`)
| Method | Path                          | Description                       |
|--------|-------------------------------|-----------------------------------|
| GET    | `/api/groups/<id>/posts`      | List posts with nested replies    |
| POST   | `/api/groups/<id>/posts`      | Create post / reply (`parent_id`) |
| DELETE | `/api/groups/posts/<id>`      | Delete post (author or admin)     |

### Notifications (`/api/notifications`)
| Method     | Path                              | Description                       |
|------------|-----------------------------------|-----------------------------------|
| GET        | `/api/notifications`              | List (`?unread=true` to filter)   |
| PUT/PATCH  | `/api/notifications/<id>/read`    | Mark one read                     |
| PUT/PATCH  | `/api/notifications/read-all`     | Mark all read                     |
| DELETE     | `/api/notifications/<id>`         | Delete notification               |

### Dashboard (`/api/dashboard`)
| Method | Path             | Description                        |
|--------|------------------|------------------------------------|
| GET    | `/api/dashboard` | Aggregated stats for the home view |

## Project structure

```
backend/
├── app.py            # application factory + entry point
├── config.py         # configuration
├── extensions.py     # db, jwt instances
├── models.py         # SQLAlchemy models
├── seed.py           # demo data seeding
├── requirements.txt
├── README.md
└── routes/
    ├── __init__.py
    ├── auth.py
    ├── subjects.py
    ├── groups.py
    ├── syllabus.py
    ├── progress.py
    ├── tasks.py
    ├── notifications.py
    ├── dashboard.py
    └── discussion.py
```
