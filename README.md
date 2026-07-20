# StudyBuddy 📚

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite)
![Flask](https://img.shields.io/badge/Flask-Backend-000000?logo=flask)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)

A **full-stack Human-Computer Interaction (HCI)** semester project that helps university students **find study partners, create study groups, organize syllabi, track academic progress, and manage study tasks** through an intuitive, user-centered web application.

Designed using **Nielsen's 10 Usability Heuristics**, **Shneiderman's 8 Golden Rules**, **WCAG AA Accessibility Guidelines**, and modern **User-Centered Design (UCD)** principles.

---

> **Stack:** React + Vite + Tailwind CSS + React Router (frontend) · Python Flask + SQLAlchemy + JWT (backend) · SQLite (database)

---

# 📑 Table of Contents

- Overview
- Features
- Project Screenshots
- Repository Structure
- Tech Stack
- Quick Start
- HCI Principles
- Database
- Deliverables
- Future Improvements

---

# 🚀 Overview

StudyBuddy addresses the challenge students face in finding compatible study partners and effectively managing collaborative learning.

The application enables users to:

- Create and manage study groups
- Find study partners based on subjects and preferences
- Organize course syllabi into weekly study plans
- Track learning progress
- Manage study tasks and deadlines
- Receive notifications and reminders
- Participate in discussion forums

---

# ✨ Features

| Feature | Highlights |
|----------|------------|
| 👤 Accounts & Profile | Sign up, Login, JWT Authentication, Profile Management |
| 🤝 Smart Group Matching | Find groups by subject, semester, skill level |
| 👥 Study Groups | Group management, join requests, discussions |
| 📚 Syllabus Breakdown | Automatically organize topics into weekly study plans |
| 📈 Progress Tracking | Progress bars, study streaks, weekly goals |
| 📅 Study Planner | Tasks, deadlines, reminders, calendar planning |
| 📊 Dashboard | Study statistics, recommended groups, upcoming tasks |
| 🔔 Notifications | Group invites, reminders, join requests |

---

# 📸 Project Screenshots

## ✏️ Low-Fidelity Wireframes
| Dashboard |
|-----------|
| ![](Low%20Fidelity%20Wireframes/Dashboard%20LF.png) |

| Study Groups | Planner |
|--------------|----------|
| ![](Low%20Fidelity%20Wireframes/Study%20Groups%20LF.png) | ![](Low%20Fidelity%20Wireframes/Planner.png) |

---

## 🎨 High-Fidelity Prototype

| Login | Dashboard |
|-------|-----------|
| ![](High%20Fidelity%20Prototypes/Login%20Page.png) | ![](High%20Fidelity%20Prototypes/Dashboard.png) |

| Study Groups | Subjects |
|--------------|----------|
| ![](High%20Fidelity%20Prototypes/Study%20Groups.png) | ![](High%20Fidelity%20Prototypes/Subjects%20Page.png) |

| Planner | Progress Tracking |
|----------|-------------------|
| ![](High%20Fidelity%20Prototypes/Planner.png) | ![](High%20Fidelity%20Prototypes/Progress.png) |

---

## 🎯 Design Evolution

The project followed a **User-Centered Design (UCD)** methodology.

The interface was first designed using **low-fidelity wireframes** to validate navigation, layout, and usability. Based on usability analysis and HCI principles, these wireframes evolved into **high-fidelity interactive prototypes** with improved accessibility, visual hierarchy, and consistency.

Design Principles Applied:

- Nielsen's 10 Usability Heuristics
- Shneiderman's 8 Golden Rules
- WCAG AA Accessibility
- User-Centered Design
- Responsive Design
- Minimalist Interface

---

# 📁 Repository Structure

```
StudyBuddy/
│
├── README.md
│
├── docs/
│   ├── 01-project-overview.md
│   ├── 02-user-analysis-personas.md
│   ├── 03-use-cases.md
│   ├── 04-use-case-diagram.md
│   ├── 05-system-architecture.md
│   ├── 06-database-design.md
│   ├── 07-wireframes.md
│   ├── 08-ui-design.md
│   ├── 09-hci-principles.md
│   ├── 10-testing.md
│   ├── 11-project-report.md
│   ├── 12-heuristic-evaluation.md
│   └── 13-statistical-analysis.md
│
├── backend/
│   ├── routes/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── requirements.txt
│   └── studybuddy.db
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── High Fidelity Prototypes/
│
└── Low Fidelity Wireframes/
```

---

# 🛠 Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router

### Backend

- Python
- Flask
- SQLAlchemy
- Flask-JWT-Extended

### Database

- SQLite

### Development Tools

- Git
- GitHub
- Figma
- PlantUML
- Mermaid

---

# 🚀 Quick Start

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

Backend runs at

```
http://localhost:5000
```

Demo Password

```
password123
```

Demo Users

- alice@university.edu
- bob@university.edu
- carol@university.edu

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Open

```
http://localhost:5173
```

---

# 🧠 HCI Principles Applied

The interface was designed following established Human-Computer Interaction principles.

### Nielsen's Usability Heuristics

- Visibility of system status
- Match between system and real world
- User control and freedom
- Consistency and standards
- Error prevention
- Recognition rather than recall
- Flexibility and efficiency
- Aesthetic and minimalist design
- Error recovery
- Help and documentation

### Shneiderman's Golden Rules

- Consistency
- Shortcuts
- Informative feedback
- Dialog closure
- Error handling
- Easy reversal
- Internal locus of control
- Reduced memory load

### Accessibility

- WCAG AA contrast
- Keyboard navigation
- ARIA labels
- Semantic HTML
- Focus indicators
- Screen-reader support

---

# 📊 Database

The application consists of **11 relational tables**.

- Users
- Subjects
- StudyGroups
- GroupMembers
- GroupJoinRequests
- Syllabus
- Topics
- Progress
- Tasks
- Notifications
- DiscussionPosts

The schema is implemented using SQLAlchemy and automatically created during initialization.

---

# 📦 Deliverables

✅ Project Overview

✅ User Analysis & Personas

✅ Use Cases

✅ Use Case Diagram

✅ System Architecture

✅ Database Design

✅ Wireframes

✅ UI Design

✅ HCI Principles

✅ Testing & Evaluation

✅ Heuristic Evaluation

✅ Statistical Analysis

✅ Full Project Report

---

# 🚀 Future Improvements

- AI-powered study partner recommendations
- Real-time group chat
- Video meeting integration
- Calendar synchronization
- Email notifications
- Mobile application
- Analytics dashboard
- AI study assistant

---
Built as a university Human-Computer Interaction semester project.

---

⭐ If you found this project useful, consider giving it a star.


