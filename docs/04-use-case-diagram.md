# StudyBuddy — Use-Case Diagram

**Project:** StudyBuddy — A web application that helps university students find study partners, create/join study groups, break syllabi into weekly topics, track academic progress, and plan study tasks.

**Document:** Use-Case Diagram (PlantUML)
**Version:** 1.0
**Date:** 2026-06-13

This document provides the graphical use-case model for StudyBuddy as PlantUML source. It complements the textual specifications in `03-use-cases.md`.

---

## 1. Actors

- **Student** — general authenticated user.
- **Group Admin** — a Student who owns a group (generalization: Group Admin *is a* Student).
- **System** — automated backend (matching, topic generation, progress computation, notifications).

---

## 2. Full Use-Case Diagram

```plantuml
@startuml StudyBuddy_UseCases
left to right direction
skinparam packageStyle rectangle
skinparam actorStyle awesome
skinparam shadowing false
skinparam linetype ortho

title StudyBuddy — Use-Case Diagram

' ===== Actors =====
actor "Student" as Student
actor "Group Admin" as Admin
actor "System" as System

' Group Admin is a specialized Student
Admin --|> Student

rectangle "StudyBuddy" {

  ' ----- Accounts & Profile -----
  usecase "UC-01 Register" as UC01
  usecase "UC-02 Login" as UC02
  usecase "UC-03 Logout" as UC03
  usecase "UC-04 Manage Profile" as UC04

  ' ----- Groups & Matching -----
  usecase "UC-05 Find / Match\nStudy Group" as UC05
  usecase "UC-06 Create\nStudy Group" as UC06
  usecase "UC-07 Join Study Group\n(Send Request)" as UC07
  usecase "UC-08 Accept / Reject\nJoin Request" as UC08
  usecase "UC-09 Leave\nStudy Group" as UC09
  usecase "UC-10 Add / Remove\nMember (Admin)" as UC10
  usecase "UC-11 Post on\nDiscussion Board" as UC11

  ' ----- Syllabus, Topics & Progress -----
  usecase "UC-12 Add Subject &\nEnter/Upload Syllabus" as UC12
  usecase "UC-13 Auto-Generate\nWeekly Topics" as UC13
  usecase "UC-14 Mark Topic Complete /\nTrack Progress" as UC14

  ' ----- Planner, Dashboard, Notifications -----
  usecase "UC-15 Add Task &\nDeadline (Planner)" as UC15
  usecase "UC-16 View Dashboard" as UC16
  usecase "UC-17 Receive\nNotifications" as UC17
}

' ===== Student associations =====
Student --> UC01
Student --> UC02
Student --> UC03
Student --> UC04
Student --> UC05
Student --> UC06
Student --> UC07
Student --> UC09
Student --> UC11
Student --> UC12
Student --> UC14
Student --> UC15
Student --> UC16
Student --> UC17

' ===== Group Admin associations (admin-only) =====
Admin --> UC08
Admin --> UC10

' ===== System (automated) associations =====
System --> UC05
System --> UC13
System --> UC17

' ===== include relationships =====
UC12 ..> UC13 : <<include>>
UC06 ..> UC04 : <<include>>
UC05 ..> UC17 : <<include>>
UC07 ..> UC17 : <<include>>
UC08 ..> UC17 : <<include>>
UC10 ..> UC17 : <<include>>
UC11 ..> UC17 : <<include>>
UC14 ..> UC17 : <<include>>
UC15 ..> UC17 : <<include>>
UC13 ..> UC14 : <<include>>

' ===== extend relationships =====
UC08 ..> UC07 : <<extend>>
UC05 ..> UC07 : <<extend>>
UC10 ..> UC09 : <<extend>>

@enduml
```

---

## 3. Focused Sub-Diagram — Study Group Lifecycle

A smaller diagram zooming into the group/membership workflow, useful for presentations.

```plantuml
@startuml StudyBuddy_GroupLifecycle
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false
title StudyBuddy — Study Group Lifecycle

actor "Student" as Student
actor "Group Admin" as Admin
actor "System" as System
Admin --|> Student

rectangle "Study Groups" {
  usecase "Find / Match Group" as Find
  usecase "Create Group" as Create
  usecase "Join (Send Request)" as Join
  usecase "Accept / Reject Request" as Decide
  usecase "Leave Group" as Leave
  usecase "Add / Remove Member" as Manage
  usecase "Delete Group" as Delete
  usecase "Post on Discussion Board" as Post
  usecase "Receive Notifications" as Notify
}

Student --> Find
Student --> Create
Student --> Join
Student --> Leave
Student --> Post
Admin --> Decide
Admin --> Manage
Admin --> Delete

System --> Find
System --> Notify

Find ..> Join : <<extend>>
Join ..> Decide : <<extend>>
Decide ..> Notify : <<include>>
Manage ..> Notify : <<include>>
Manage ..> Delete : <<extend>>
Post ..> Notify : <<include>>

@enduml
```

---

## 4. Legend

| Notation | Meaning |
|----------|---------|
| **Actor (stick figure)** | A role interacting with the system (Student, Group Admin, System). |
| **Oval (use case)** | A discrete unit of functionality. |
| **Solid line** (actor — use case) | Association: the actor participates in the use case. |
| **Hollow triangle arrow** `--|>` | Generalization: *Group Admin is a Student* and inherits all Student use cases. |
| **Dashed arrow `<<include>>`** | The base use case **always** invokes the included use case as part of its flow. |
| **Dashed arrow `<<extend>>`** | The extending use case **conditionally** adds behavior to the base use case. |

**Key relationships captured:**
- *Group Admin* generalizes *Student* — admins can do everything a student can, plus admin-only actions (UC-08, UC-10).
- *Add Subject & Syllabus* (UC-12) **includes** *Auto-Generate Weekly Topics* (UC-13), which in turn **includes** *Track Progress* (UC-14) via baseline initialization.
- Notification-emitting use cases (UC-05, UC-07, UC-08, UC-10, UC-11, UC-14, UC-15) **include** *Receive Notifications* (UC-17).
- *Find/Match* (UC-05) and *Accept/Reject* (UC-08) **extend** *Join Study Group* (UC-07).

---

## 5. Rendering Instructions

You can render the PlantUML diagrams above using any of the following:

**Option A — Online (no install):**
1. Go to <https://www.plantuml.com/plantuml>.
2. Paste the code from a `@startuml … @enduml` block.
3. The diagram renders instantly; export as PNG/SVG.

**Option B — VS Code (recommended):**
1. Install the **PlantUML** extension (by jebbs) from the Marketplace.
2. Install a local renderer dependency: **Java (JRE 8+)** and **Graphviz** (`dot`), or configure the extension to use the public PlantUML server.
3. Open this Markdown file, place the cursor inside a `plantuml` block, and press `Alt+D` to preview, or use *PlantUML: Export Current Diagram*.

**Option C — CLI:**
1. Download `plantuml.jar` from <https://plantuml.com/download>.
2. Save a block to `diagram.puml` and run: `java -jar plantuml.jar diagram.puml` to produce `diagram.png`.

> **Tip:** Markdown viewers such as GitHub do not render PlantUML natively. Use one of the methods above, or a Markdown-with-PlantUML renderer, to view the diagrams.
