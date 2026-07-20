# StudyBuddy — Project Overview

**Document:** 01 — Project Overview
**Project:** StudyBuddy — Find Study Partners, Build Better Study Habits
**Course:** Human-Computer Interaction (HCI)
**Date:** 13 June 2026

---

## 1. Introduction

University students rarely struggle alone for lack of intelligence — they struggle for lack of structure, accountability, and the right people to study with. Lectures move quickly, syllabi are dense, deadlines stack up across multiple subjects, and the people best positioned to help (peers taking the same courses in the same semester) are often invisible to one another. A first-year student wrestling with introductory calculus may be sitting two rows away from a peer who has already mastered it, yet the two never connect.

**StudyBuddy** is a web application that helps university students find compatible study partners, create and join study groups, break their syllabi into manageable weekly topics, track their academic progress, and plan their study tasks. It combines a social matching layer (connecting students by subject, semester, skill level, and availability) with a personal productivity layer (syllabus breakdown, progress tracking, and a study planner), all surfaced through a single unified dashboard.

The application is designed from a Human-Computer Interaction perspective: the central goal is not merely to store data, but to reduce the cognitive and social friction that prevents students from studying effectively together. Every feature is evaluated against a simple question — *does this make it easier for a student to take the next useful study action?*

This document establishes the canonical project definition: the problem being solved, the measurable objectives, the scope boundaries, the target platform, the feature set, the technology stack, and the criteria by which success will be judged. All subsequent design and documentation artefacts derive from the definitions stated here.

---

## 2. Problem Statement

Despite being surrounded by peers, university students face several persistent and well-documented problems when trying to study effectively:

- **Isolation in a crowd.** Students taking identical courses in the same semester have no reliable way to discover one another. Informal channels (chance encounters, large unstructured group chats) are noisy, exclusionary, and unreliable. Finding a *compatible* partner — one matched on subject, level, schedule, and study style — is left almost entirely to luck.

- **Poor scheduling compatibility.** Even when students want to study together, mismatched availability quietly kills most attempts. Without a shared view of when each person is genuinely free, groups default to whoever is loudest rather than whoever is actually available.

- **Overwhelming, unstructured syllabi.** A syllabus is typically a flat, intimidating document. Students lack an easy way to decompose it into weekly topics, making it hard to know what to study, in what order, and whether they are keeping pace.

- **Invisible progress.** Students often cannot tell how far through a subject they actually are. Without visible percentages, progress bars, weekly targets, or streaks, motivation erodes and procrastination compounds silently until an exam exposes the gap.

- **Fragmented planning.** Tasks, deadlines, and reminders live scattered across notebooks, phone alarms, and memory. There is no single planner that ties study tasks to subjects, deadlines, and group activity.

- **Weak accountability.** Solo study offers no social reinforcement. Group study, done well, creates commitment — but only if the group has structure: a discussion board, a shared progress tracker, and clear admin controls.

The result is a measurable cost: wasted study hours, missed deadlines, uneven workloads, lower grades, and avoidable stress. **StudyBuddy addresses this by uniting partner matching, group collaboration, syllabus structuring, progress tracking, and study planning in one coherent, student-centred web application.**

---

## 3. Objectives

The objectives below are numbered and expressed in measurable terms so that project success can be evaluated objectively.

1. **Enable rich student profiles.** Allow every user to create an account and profile capturing name, university, semester, enrolled subjects, study preferences, availability schedule, and learning style — with at least 90% of these fields completable within the first onboarding session.

2. **Deliver smart study-group matching.** Recommend study partners and groups matched on subject, semester, skill level, and schedule compatibility, surfacing at least 3 relevant recommendations to a fully-profiled user on their dashboard.

3. **Support full group lifecycle.** Let students create study groups, request to join groups, approve or reject join requests via admin controls, and collaborate through a per-group discussion board and shared progress tracker.

4. **Structure syllabi into weekly topics.** Provide a syllabus-breakdown feature that decomposes a subject into ordered weekly units (Week 1 / Topic A, Week 2 / Topic B, ...), so any subject can be navigated topic-by-topic.

5. **Make progress visible and motivating.** Track progress per subject and topic using percentages, progress bars, weekly targets, and a study streak, updating in real time as topics are marked complete.

6. **Provide an effective study planner.** Allow students to create tasks with deadlines, view them in weekly and monthly views, and receive reminders, so that no scheduled study task is silently lost.

7. **Centralise everything in a dashboard.** Present upcoming tasks, recent group activity, study hours, progress statistics, and recommended groups on a single dashboard reachable within one click of login.

8. **Keep students informed via notifications.** Generate timely notifications for group invites, task deadlines, progress reminders, and new join requests.

9. **Achieve strong usability.** Meet usability targets defined in the Success Criteria (Section 9), including high task-completion rates and a favourable System Usability Scale (SUS) score in evaluation.

---

## 4. Scope

### 4.1 In Scope

- User registration, authentication (JWT-based), and profile management.
- Profile attributes: name, university, semester, subjects, study preferences, availability schedule, learning style.
- Smart matching of study partners and groups by subject, semester, skill level, and schedule.
- Study group creation, join requests, admin approval/rejection, and member management.
- Per-group discussion board and shared progress tracker.
- Syllabus entry and breakdown into weekly topics.
- Progress tracking: percentages, progress bars, weekly targets, study streak.
- Study planner: tasks, deadlines, weekly/monthly views, reminders.
- Unified dashboard summarising tasks, group activity, study hours, progress, and recommendations.
- In-app notifications for invites, deadlines, progress reminders, and join requests.
- Responsive web interface suitable for desktop and tablet browsers.

### 4.2 Out of Scope

- Native mobile applications (iOS / Android). StudyBuddy is a responsive **web** application only.
- Real-time video or voice conferencing within groups.
- Integrated messaging/chat beyond the per-group discussion board.
- Payment processing, subscriptions, or any monetisation.
- Direct integration with university LMS platforms (e.g., Moodle, Canvas) or student information systems.
- AI tutoring, automated answer generation, or content authoring of study material.
- Email / SMS / push delivery of notifications outside the application (in-app notifications only).
- Administrative analytics for institutions, faculty dashboards, or reporting.

---

## 5. Target Platform

StudyBuddy is a **responsive web application** delivered through modern desktop and tablet web browsers (current versions of Chrome, Firefox, Edge, and Safari). It requires no installation and runs entirely in the browser, communicating with a backend API over HTTPS.

- **Primary devices:** laptop and desktop browsers, where students do most focused planning and study.
- **Secondary devices:** tablets, supported through a responsive layout.
- **Mobile phones:** the layout degrades gracefully on small screens, but a dedicated native mobile app is explicitly out of scope for this project.

The single-page application (SPA) architecture, built with React and React Router, provides fast in-app navigation without full page reloads, while the Flask backend exposes a JSON API consumed by the frontend.

---

## 6. Key Features Summary

| # | Feature | Description | Primary Benefit |
|---|---------|-------------|-----------------|
| 1 | Accounts & Profile | Create account and profile: name, university, semester, subjects, study preferences, availability schedule, learning style. | Establishes identity and the data that powers matching. |
| 2 | Smart Group Matching | Match partners and groups by subject, semester, skill level, and schedule compatibility. | Connects compatible students quickly. |
| 3 | Study Groups | Group creation, join requests, admin controls, discussion board, and shared progress tracker. | Structured, accountable collaboration. |
| 4 | Syllabus Breakdown | Decompose a subject's syllabus into ordered weekly topics (Week 1 / Topic A, ...). | Turns dense syllabi into a clear study path. |
| 5 | Progress Tracking | Percentages, progress bars, weekly targets, and a study streak per subject/topic. | Makes progress visible and motivating. |
| 6 | Study Planner | Tasks with deadlines, weekly/monthly views, and reminders. | Keeps study tasks organised and on time. |
| 7 | Dashboard | Upcoming tasks, group activity, study hours, progress stats, recommended groups. | One-glance overview of everything that matters. |
| 8 | Notifications | Group invites, task deadlines, progress reminders, new join requests. | Keeps students informed and responsive. |

---

## 7. Technology Stack

| Layer | Technology | Role in StudyBuddy |
|-------|-----------|--------------------|
| Frontend framework | React.js | Component-based single-page user interface. |
| Styling | Tailwind CSS | Utility-first, responsive styling across all views. |
| Client routing | React Router | In-app navigation between dashboard, groups, planner, and profile. |
| Backend framework | Python Flask | REST API serving all application logic. |
| ORM / data layer | Flask-SQLAlchemy | Object-relational mapping over the database tables. |
| Authentication | JWT (JSON Web Tokens) | Stateless, token-based authentication and authorisation. |
| Database | SQLite | Lightweight relational store for all application data. |

### 7.1 Database Tables

The data model is implemented across the following tables: **Users, Subjects, StudyGroups, GroupMembers, GroupJoinRequests, Syllabus, Topics, Progress, Tasks, Notifications, DiscussionPosts.**

| Table | Purpose |
|-------|---------|
| Users | Accounts, credentials, and profile attributes. |
| Subjects | Subjects/courses a student is enrolled in. |
| StudyGroups | Study groups, their metadata and ownership. |
| GroupMembers | Membership and roles linking users to groups. |
| GroupJoinRequests | Pending requests to join groups, for admin approval. |
| Syllabus | Syllabus records associated with subjects. |
| Topics | Weekly topics derived from a syllabus breakdown. |
| Progress | Per-user, per-topic/subject progress records. |
| Tasks | Planner tasks with deadlines and reminders. |
| Notifications | In-app notification events for each user. |
| DiscussionPosts | Posts on per-group discussion boards. |

---

## 8. Assumptions and Constraints

### 8.1 Assumptions

- Users are university students with valid email addresses and reliable internet access.
- Students know their own enrolled subjects, semester, and broad availability and can enter them honestly.
- Students self-report skill level and learning style; the matching engine relies on the accuracy of these inputs.
- A modern, JavaScript-enabled browser is available on the user's device.
- Syllabus content is supplied by the student (entered or pasted); the app structures rather than authors it.

### 8.2 Constraints

- **Platform:** web only — no native mobile apps within this project.
- **Database:** SQLite, suited to the project's scale; not intended for very large concurrent production loads.
- **Notifications:** in-app only; no external email/SMS/push delivery.
- **Stack:** fixed to React + Tailwind + React Router (frontend) and Flask + Flask-SQLAlchemy + JWT (backend).
- **Timeline & resources:** delivered within an academic-semester schedule by a student team, constraining feature depth.
- **Privacy:** profile data (availability, university, subjects) must be handled responsibly and visible only as needed for matching and group collaboration.

---

## 9. Success Criteria

StudyBuddy will be considered successful when the following criteria are met:

### 9.1 Functional Criteria

- A new user can register, complete a profile, and reach the dashboard without external help.
- A fully-profiled user receives at least 3 relevant group/partner recommendations based on subject, semester, skill level, and schedule.
- A user can create a group, another user can request to join, and an admin can approve or reject that request.
- A subject's syllabus can be broken into ordered weekly topics, and marking topics complete updates progress percentages and bars.
- A user can create a task with a deadline, see it in weekly and monthly views, and receive a reminder/notification.
- The dashboard correctly aggregates upcoming tasks, group activity, study hours, progress stats, and recommended groups.

### 9.2 Usability Criteria (HCI)

- **Task completion:** at least 90% of test users complete core tasks (register, find a group, break down a syllabus, add a task) unaided.
- **Efficiency:** core tasks completed within target time (e.g., creating a task in under 60 seconds).
- **Satisfaction:** average System Usability Scale (SUS) score of 70 or above.
- **Error rate:** low rate of user errors on primary flows, with clear recovery paths.
- **Learnability:** first-time users can navigate to any core feature within two clicks of the dashboard.

### 9.3 Quality Criteria

- Consistent, responsive UI across desktop and tablet.
- Secure authentication using JWT, with protected routes for authenticated users only.
- Stable performance under expected classroom-scale usage.

---

*End of Document 01 — Project Overview.*
