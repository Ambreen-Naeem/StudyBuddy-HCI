# StudyBuddy 📚

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite)
![Flask](https://img.shields.io/badge/Flask-Backend-000000?logo=flask)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)
![HCI](https://img.shields.io/badge/HCI-Project-success)
![License](https://img.shields.io/badge/License-Academic-blue)


A full-stack **Human-Computer Interaction (HCI)** semester project: a web application that helps university students find study partners, create and manage study groups, break syllabi into weekly topics, track academic progress, and plan their study tasks — designed around Nielsen's heuristics, Shneiderman's golden rules, accessibility (WCAG AA), and user-centered UX principles.

> **Stack:** React + Vite + Tailwind CSS + React Router (frontend) · Python Flask + SQLAlchemy + JWT (backend) · SQLite (database)

---

## ✨ Features

| # | Feature | Highlights |
|---|---------|-----------|
| 1 | **Accounts & Profile** | Sign up / login / logout, profile with university, semester, subjects, study preferences, availability schedule, learning style |
| 2 | **Smart Group Matching** | Find groups by subject / semester / skill level; recommended groups; join requests, accept/reject, leave |
| 3 | **Study Groups** | Members, discussion board (with replies), group progress tracker, admin controls (create/delete, add/remove members) |
| 4 | **Syllabus Breakdown** | Add a subject, enter topics → auto-laid-out as Week 1 / Topic A, Week 2 / Topic B … |
| 5 | **Progress Tracking** | Mark topics complete, percentage + progress bars, weekly targets, remaining topics, **study streak** |
| 6 | **Study Planner** | Tasks & deadlines, weekly/monthly views, reminders, overdue badges |
| 7 | **Dashboard** | Upcoming tasks, group activity, study hours, progress stats, recommended groups |
| 8 | **Notifications** | Group invites, task deadlines, progress reminders, new join requests; mark read |

---

## 📁 Repository Structure

```
StudyBuddy/
├── README.md                  ← you are here
├── docs/                      ← full HCI documentation & report (deliverables)
│   ├── 01-project-overview.md       Introduction, problem, objectives, scope
│   ├── 02-user-analysis-personas.md User analysis + 3 detailed personas
│   ├── 03-use-cases.md              12+ formal use-case descriptions
│   ├── 04-use-case-diagram.md       PlantUML use-case diagram
│   ├── 05-system-architecture.md    3-tier architecture + PlantUML diagrams
│   ├── 06-database-design.md        ER diagram (Mermaid + PlantUML) + full SQL schema
│   ├── 07-wireframes.md             Low-fidelity wireframes for all key screens
│   ├── 08-ui-design.md              Color palette, typography, design system
│   ├── 09-hci-principles.md         ★ Nielsen + Shneiderman + accessibility + UX
│   ├── 10-testing.md                Usability test plan, scenarios, SUS, checklist
│   └── 11-project-report.md         ★ Full 30–40 page university report
├── backend/                   ← Flask REST API
│   ├── app.py  config.py  extensions.py  models.py  seed.py
│   ├── requirements.txt  README.md
│   └── routes/  (auth, subjects, groups, syllabus, progress, tasks,
│                 notifications, dashboard, discussion)
└── frontend/                  ← React + Vite + Tailwind SPA
    ├── package.json  vite.config.js  tailwind.config.js  index.html
    ├── README.md
    └── src/  (api, context, hooks, components ×16, pages ×14)
```

---

## 🚀 Quick Start (Windows / PowerShell)

You need **two terminals** — one for the backend, one for the frontend.

### 1. Backend — Flask API (port 5000)

```powershell
cd "E:\HCI project\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

On first run this auto-creates and **seeds** `studybuddy.db` with demo data, then serves the API at **http://localhost:5000**.

**Demo logins** (password for all: `password123`):
`alice@university.edu` · `bob@university.edu` · `carol@university.edu`

Health check: open http://localhost:5000/api/health

### 2. Frontend — React app (port 5173)

```powershell
cd "E:\HCI project\frontend"
npm install
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` → the Flask backend on port 5000, so no CORS setup is needed in development.

---

## 🧠 HCI Principles Applied

This project is built as an HCI deliverable. Every major principle is implemented and documented (see **[docs/09-hci-principles.md](docs/09-hci-principles.md)** for the full traceability matrix):

- **Nielsen's 10 Usability Heuristics** — visibility of system status (toasts, loading/progress states), match with real world (weekly syllabus, "study streak"), user control & freedom (leave group, undo via confirm dialogs), consistency & standards (shared design system), error prevention (validation, confirm dialogs), recognition over recall (recommended groups, prefilled forms), flexibility (keyboard nav, weekly/monthly toggle), aesthetic & minimalist design, error recovery (clear inline + toast errors), help & documentation.
- **Shneiderman's 8 Golden Rules** — consistency, shortcuts, informative feedback, dialog closure, simple error handling, easy reversal, internal locus of control, reduced memory load.
- **Accessibility** — semantic HTML, ARIA labels/roles, visible focus rings, full keyboard navigation, skip link, color-blind-friendly UI (icon + text, never color alone), WCAG AA contrast.
- **UX** — user-centered design, simple navigation, clear feedback, minimal cognitive load, visual hierarchy, progressive disclosure.

---

## 📊 Database

11 tables: **Users, Subjects, StudyGroups, GroupMembers, GroupJoinRequests, Syllabus, Topics, Progress, Tasks, Notifications, DiscussionPosts**. Full ER diagram and runnable `CREATE TABLE` SQL are in **[docs/06-database-design.md](docs/06-database-design.md)**. The Flask backend builds the same schema automatically via SQLAlchemy.

---

## 📦 Deliverables Checklist

| Deliverable | Location |
|-------------|----------|
| Project Overview | [docs/01-project-overview.md](docs/01-project-overview.md) |
| User Analysis + Personas | [docs/02-user-analysis-personas.md](docs/02-user-analysis-personas.md) |
| Use Cases | [docs/03-use-cases.md](docs/03-use-cases.md) |
| Use Case Diagram (PlantUML) | [docs/04-use-case-diagram.md](docs/04-use-case-diagram.md) |
| System Architecture | [docs/05-system-architecture.md](docs/05-system-architecture.md) |
| Database Design (ER + SQL) | [docs/06-database-design.md](docs/06-database-design.md) |
| Wireframes | [docs/07-wireframes.md](docs/07-wireframes.md) |
| UI Design System | [docs/08-ui-design.md](docs/08-ui-design.md) |
| HCI Principles | [docs/09-hci-principles.md](docs/09-hci-principles.md) |
| Testing & Evaluation | [docs/10-testing.md](docs/10-testing.md) |
| Full Project Report (30–40 pp) | [docs/11-project-report.md](docs/11-project-report.md) |
| Heuristic Evaluation Report (applied) | [docs/12-heuristic-evaluation.md](docs/12-heuristic-evaluation.md) |
| Statistical Analysis of Usability Data | [docs/13-statistical-analysis.md](docs/13-statistical-analysis.md) |
| React Frontend | [frontend/](frontend/) |
| Flask Backend | [backend/](backend/) |

---

## 🛠️ Tech Notes

- **Auth:** JWT (Flask-JWT-Extended). The frontend stores the token in `localStorage` and attaches it as a `Bearer` header via an axios interceptor; a 401 redirects to login.
- **Rendering diagrams:** PlantUML blocks render at [plantuml.com/plantuml](https://www.plantuml.com/plantuml) or the VS Code *PlantUML* extension; Mermaid blocks render on GitHub or with the *Markdown Preview Mermaid* extension.
- **Point the frontend at another backend:** edit `frontend/src/api/client.js` (baseURL) or `frontend/vite.config.js` (dev proxy target).

---

*Built as a university Human-Computer Interaction semester project.*
