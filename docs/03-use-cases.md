# StudyBuddy — Use-Case Descriptions

**Project:** StudyBuddy — A web application that helps university students find study partners, create and join study groups, break syllabi into weekly topics, track academic progress, and plan study tasks.

**Stack:** React.js + Tailwind CSS + React Router (frontend); Python Flask + Flask-SQLAlchemy + JWT auth (backend); SQLite database.

**Document:** Formal Use-Case Specifications
**Version:** 1.0
**Date:** 2026-06-13

---

## 1. Actors

| Actor | Description |
|-------|-------------|
| **Student** | A general authenticated user of StudyBuddy. Can manage a profile, find/join groups, manage subjects and syllabi, track progress, and plan tasks. |
| **Group Admin** | A Student who owns (created) a study group. Inherits all Student capabilities and additionally manages group membership, join requests, and group deletion. |
| **System** | The automated StudyBuddy backend. Performs smart matching, auto-generates weekly topics, computes progress/streaks, and dispatches notifications. |

> **Note:** A Group Admin is always also a Student. Where a use case is available to any logged-in user, the actor is listed as *Student* (which therefore includes Group Admins).

---

## 2. Use-Case Summary Table

| ID | Use Case | Primary Actor | Secondary Actor(s) | Priority |
|------|------------------------------------------|---------------|--------------------|----------|
| UC-01 | Register | Student | System | High |
| UC-02 | Login | Student | System | High |
| UC-03 | Logout | Student | — | Medium |
| UC-04 | Manage Profile | Student | System | High |
| UC-05 | Find / Match Study Group | Student | System | High |
| UC-06 | Create Study Group | Student (becomes Group Admin) | System | High |
| UC-07 | Join Study Group (Send Request) | Student | System | High |
| UC-08 | Accept / Reject Join Request | Group Admin | System | High |
| UC-09 | Leave Study Group | Student | System | Medium |
| UC-10 | Add / Remove Member | Group Admin | System | Medium |
| UC-11 | Post on Discussion Board | Student | System | Medium |
| UC-12 | Add Subject & Enter/Upload Syllabus | Student | System | High |
| UC-13 | Auto-Generate Weekly Topics | System | Student | High |
| UC-14 | Mark Topic Complete / Track Progress | Student | System | High |
| UC-15 | Add Task & Deadline (Planner) | Student | System | High |
| UC-16 | View Dashboard | Student | System | Medium |
| UC-17 | Receive Notifications | Student | System | Medium |

---

## 3. Use-Case Specifications

Each use case below follows a formal template: **ID, Name, Actor(s), Description, Preconditions, Postconditions, Main Success Scenario, Alternative Flows, Exceptions, Priority.**

---

### UC-01 — Register

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-01 |
| **Name** | Register |
| **Actor(s)** | Student (primary), System |
| **Description** | A new visitor creates a StudyBuddy account by supplying account and academic details, enabling access to all student features. |
| **Preconditions** | The visitor is not logged in and does not yet have an account with the supplied email. |
| **Postconditions** | A new record is inserted into the `Users` table; the password is stored as a salted hash; the user may now log in. A welcome notification is created. |
| **Priority** | High |

**Main Success Scenario**
1. The Student navigates to the Registration page.
2. The Student enters full name, university email, password, and password confirmation.
3. The Student enters academic details (university, semester, and optionally initial subjects and skill level).
4. The Student submits the form.
5. The System validates all fields (format, password strength, matching confirmation).
6. The System confirms the email is not already registered.
7. The System hashes the password and persists a new `Users` record.
8. The System creates a welcome `Notifications` entry.
9. The System displays a success message and redirects to the Login page (or auto-logs the user in).

**Alternative Flows**
- **2a. Social/SSO registration (optional future scope):** The Student chooses university SSO; the System provisions the account from the identity provider claims and skips steps 2–6.
- **9a. Auto-login enabled:** Instead of redirecting to Login, the System issues a JWT and proceeds directly to UC-16 (View Dashboard).

**Exceptions**
- **E1. Email already in use:** The System rejects the submission with the message "An account with this email already exists" and returns to the form.
- **E2. Validation failure:** Inline field errors are shown (e.g., weak password, invalid email, mismatched confirmation); no record is created.
- **E3. Database/server error:** A 500 error is shown; no partial record is committed (transaction rolled back).

---

### UC-02 — Login

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-02 |
| **Name** | Login |
| **Actor(s)** | Student (primary), System |
| **Description** | A registered user authenticates and receives a session token (JWT) granting access to protected features. |
| **Preconditions** | The user has a registered, active account. |
| **Postconditions** | A valid JWT access token is issued and stored client-side; the user gains an authenticated session. |
| **Priority** | High |

**Main Success Scenario**
1. The Student navigates to the Login page.
2. The Student enters email and password.
3. The Student submits the form.
4. The System looks up the user by email.
5. The System verifies the submitted password against the stored hash.
6. The System generates a signed JWT (with user id and expiry claims).
7. The System returns the token; the client stores it and redirects to the Dashboard (UC-16).

**Alternative Flows**
- **2a. Remember me:** The Student selects "Remember me"; the System issues a longer-lived token / refresh token.
- **3a. Forgot password:** The Student selects "Forgot password" and is directed to a password-reset flow (out of scope for this iteration).

**Exceptions**
- **E1. Invalid credentials:** The System returns a generic "Invalid email or password" message (no disclosure of which field was wrong).
- **E2. Account locked/disabled:** The System denies access and informs the user to contact support.
- **E3. Too many failed attempts:** The System throttles further attempts (rate limiting) and shows a retry-after message.

---

### UC-03 — Logout

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-03 |
| **Name** | Logout |
| **Actor(s)** | Student (primary) |
| **Description** | An authenticated user ends their session and discards the client-side token. |
| **Preconditions** | The user is logged in. |
| **Postconditions** | The JWT is removed from client storage; protected routes are no longer accessible until re-authentication. |
| **Priority** | Medium |

**Main Success Scenario**
1. The Student selects "Logout" from the navigation menu.
2. The client clears the stored JWT (and refresh token, if any).
3. (Optional) The client calls a `/logout` endpoint so the System can blacklist the token.
4. The client redirects to the public Login/landing page.

**Alternative Flows**
- **3a. Token blacklisting disabled:** Step 3 is skipped; logout is purely client-side token disposal.

**Exceptions**
- **E1. Logout endpoint unreachable:** The client still discards the local token so the user is logged out locally; a warning is logged.

---

### UC-04 — Manage Profile

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-04 |
| **Name** | Manage Profile |
| **Actor(s)** | Student (primary), System |
| **Description** | A user views and updates personal and academic profile data used for matching (name, avatar, university, semester, subjects, skill level, availability/schedule). |
| **Preconditions** | The user is logged in (valid JWT). |
| **Postconditions** | The `Users` record (and related `Subjects` associations) reflect the updated values. |
| **Priority** | High |

**Main Success Scenario**
1. The Student opens the Profile page.
2. The System loads current profile data from `Users` and related `Subjects`.
3. The Student edits one or more fields (e.g., semester, skill level, weekly availability).
4. The Student saves the changes.
5. The System validates the input.
6. The System persists the updates.
7. The System confirms success and re-renders the profile.

**Alternative Flows**
- **3a. Change password:** The Student opens the password sub-form, supplies current + new password; the System verifies the current password before updating the hash.
- **3b. Update availability/schedule:** The Student edits the weekly schedule grid used by the matching engine (UC-05).

**Exceptions**
- **E1. Validation failure:** Inline errors shown; no changes persisted.
- **E2. Unauthorized:** Expired/invalid JWT causes a 401 and redirect to Login.

---

### UC-05 — Find / Match Study Group

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-05 |
| **Name** | Find / Match Study Group |
| **Actor(s)** | Student (primary), System |
| **Description** | The System recommends study groups (and/or partners) ranked by compatibility on subject, semester, skill level, and schedule overlap; the Student browses and filters results. |
| **Preconditions** | The user is logged in and has at least subject/semester data on their profile for meaningful matching. |
| **Postconditions** | A ranked, filterable list of candidate groups is displayed. No data is mutated. |
| **Priority** | High |

**Main Success Scenario**
1. The Student opens the "Find Group" page.
2. The System reads the Student's subjects, semester, skill level, and schedule.
3. The **System** computes match scores for open `StudyGroups` (subject match + semester match + skill-level proximity + schedule overlap).
4. The System returns a ranked list with match scores and key attributes.
5. The Student optionally applies filters (subject, semester, skill level, day/time).
6. The Student selects a group to view its details.
7. The Student may proceed to **UC-07 (Join Study Group)**.

**Alternative Flows**
- **5a. No filters:** The Student browses the full ranked recommendation list.
- **6a. View partners instead of groups:** The Student switches to "study partner" mode; the System ranks individual students by the same criteria.

**Exceptions**
- **E1. No matches found:** The System shows an empty-state message suggesting the Student broaden filters or create a group (UC-06).
- **E2. Incomplete profile:** The System prompts the Student to complete subjects/semester to improve matching.

---

### UC-06 — Create Study Group

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-06 |
| **Name** | Create Study Group |
| **Actor(s)** | Student (primary, becomes Group Admin), System |
| **Description** | A Student creates a new study group, automatically becoming its Group Admin and first member. |
| **Preconditions** | The user is logged in. |
| **Postconditions** | A new `StudyGroups` record is created; a `GroupMembers` record links the creator as admin/owner. The group becomes discoverable via matching (UC-05). |
| **Priority** | High |

**Main Success Scenario**
1. The Student selects "Create Group".
2. The Student enters group name, subject, semester, target skill level, capacity, schedule, and visibility (open/request-only).
3. The Student submits the form.
4. The System validates the input.
5. The System creates the `StudyGroups` record with the creator as owner/admin.
6. The System inserts a `GroupMembers` record (role = admin) for the creator.
7. The System confirms creation and opens the new group's page.

**Alternative Flows**
- **2a. Private/invite-only group:** The Student marks the group private; it is excluded from public matching and joinable by invitation only.

**Exceptions**
- **E1. Duplicate group name (within subject/semester):** The System warns and asks for confirmation or a different name.
- **E2. Validation failure:** Inline errors; no group created.

---

### UC-07 — Join Study Group (Send Request)

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-07 |
| **Name** | Join Study Group (Send Request) |
| **Actor(s)** | Student (primary), System |
| **Description** | A Student requests to join an existing study group; for request-only groups this creates a pending join request awaiting admin approval. |
| **Preconditions** | The user is logged in; the group exists and is not full; the user is not already a member. |
| **Postconditions** | A `GroupJoinRequests` record (status = pending) is created, **or** for open groups the Student is added directly to `GroupMembers`. A notification is sent to the Group Admin. |
| **Priority** | High |

**Main Success Scenario**
1. The Student opens a group's details page (often from UC-05).
2. The Student selects "Request to Join".
3. The Student optionally adds a short message.
4. The System verifies the group is not full and the Student is not already a member or pending.
5. The System creates a `GroupJoinRequests` record with status = pending.
6. The **System** sends a notification to the Group Admin (UC-17).
7. The System confirms the request was sent and shows a "Request pending" state.

**Alternative Flows**
- **4a. Open group (no approval required):** The System inserts a `GroupMembers` record directly, skipping the request, and notifies the group.
- **2a. Already requested:** The button shows "Request pending" and is disabled.

**Exceptions**
- **E1. Group is full:** The System blocks the request and shows "This group is full".
- **E2. Already a member:** The action is hidden/disabled.

---

### UC-08 — Accept / Reject Join Request

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-08 |
| **Name** | Accept / Reject Join Request |
| **Actor(s)** | Group Admin (primary), System |
| **Description** | A Group Admin reviews pending join requests for their group and approves or declines each one. |
| **Preconditions** | The actor is the admin/owner of the group; one or more `GroupJoinRequests` with status = pending exist. |
| **Postconditions** | On accept: the requester is added to `GroupMembers` and the request is marked accepted. On reject: the request is marked rejected. The requester is notified. |
| **Priority** | High |

**Main Success Scenario**
1. The Group Admin opens the group's "Join Requests" panel.
2. The System lists pending requests with requester profile and match info.
3. The Group Admin selects **Accept** (or **Reject**) for a request.
4. **On Accept:** the System inserts a `GroupMembers` record and sets the request status = accepted.
5. The **System** sends a notification to the requester (UC-17).
6. The System updates the requests list (request removed from pending).

**Alternative Flows**
- **3a. Reject:** The System sets the request status = rejected and notifies the requester with an optional reason; no membership is created.
- **2a. Bulk action:** The Group Admin accepts/rejects multiple requests at once.

**Exceptions**
- **E1. Group became full:** The System blocks the accept and prompts the admin to free a slot first.
- **E2. Request already resolved:** If another admin already handled it, the System shows "Request no longer pending".
- **E3. Not authorized:** A non-admin attempting the action receives 403.

---

### UC-09 — Leave Study Group

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-09 |
| **Name** | Leave Study Group |
| **Actor(s)** | Student (primary), System |
| **Description** | A member voluntarily leaves a study group they belong to. |
| **Preconditions** | The user is logged in and is a current member of the group. |
| **Postconditions** | The corresponding `GroupMembers` record is removed; group member count decreases; remaining members/admin may be notified. |
| **Priority** | Medium |

**Main Success Scenario**
1. The Student opens the group page and selects "Leave Group".
2. The System asks for confirmation.
3. The Student confirms.
4. The System removes the `GroupMembers` record for the Student.
5. The **System** optionally notifies the Group Admin (UC-17).
6. The System confirms departure and redirects to the Student's groups list.

**Alternative Flows**
- **3a. Cancel:** The Student cancels at the confirmation step; no change is made.
- **4a. Admin is leaving:** If the leaving member is the only admin, the System prompts to transfer admin rights to another member or proceed to delete the group.

**Exceptions**
- **E1. Last member leaving:** The System offers to delete the now-empty group (links to admin delete in UC-10).
- **E2. Not a member:** The action is unavailable.

---

### UC-10 — Add / Remove Member (Admin)

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-10 |
| **Name** | Add / Remove Member (and Delete Group) |
| **Actor(s)** | Group Admin (primary), System |
| **Description** | A Group Admin exercises administrative controls: adding a member directly, removing an existing member, and deleting the group. |
| **Preconditions** | The actor is the admin/owner of the target group. |
| **Postconditions** | `GroupMembers` records are inserted or removed accordingly; on group deletion the `StudyGroups` record and dependent records are removed. Affected users are notified. |
| **Priority** | Medium |

**Main Success Scenario (Remove Member)**
1. The Group Admin opens the group's "Members" panel.
2. The System lists current members with their roles.
3. The Group Admin selects "Remove" next to a member.
4. The System asks for confirmation.
5. The Group Admin confirms.
6. The System deletes the member's `GroupMembers` record.
7. The **System** notifies the removed member (UC-17).
8. The System refreshes the members list.

**Alternative Flows**
- **A. Add member directly:** The Group Admin invites/adds a known student; the System inserts a `GroupMembers` record (and optionally notifies the new member). May reuse an accepted `GroupJoinRequests` path.
- **B. Delete group:** The Group Admin selects "Delete Group", confirms; the System removes the `StudyGroups` record and cascades deletion of `GroupMembers`, `GroupJoinRequests`, and `DiscussionPosts`; all members are notified.
- **C. Promote/transfer admin:** The Group Admin promotes another member to admin (used before leaving, per UC-09).

**Exceptions**
- **E1. Removing self as sole admin:** The System requires transferring admin rights or deleting the group instead.
- **E2. Not authorized:** Non-admin actor receives 403.
- **E3. Capacity exceeded on add:** The System blocks adding beyond group capacity.

---

### UC-11 — Post on Discussion Board

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-11 |
| **Name** | Post on Discussion Board |
| **Actor(s)** | Student (primary, must be a group member), System |
| **Description** | A group member posts a message (and replies) to the group's discussion board to coordinate study activities. |
| **Preconditions** | The user is logged in and is a member of the group. |
| **Postconditions** | A new `DiscussionPosts` record is created and visible to all group members; members may be notified. |
| **Priority** | Medium |

**Main Success Scenario**
1. The Student opens the group's Discussion Board.
2. The System loads existing `DiscussionPosts` for the group.
3. The Student types a message (optionally replying to an existing post).
4. The Student submits the post.
5. The System validates (non-empty, length limits) and persists a `DiscussionPosts` record.
6. The **System** notifies other group members (UC-17).
7. The System appends the new post to the board view.

**Alternative Flows**
- **3a. Reply:** The post references a parent post id, creating a threaded reply.
- **4a. Edit/Delete own post:** The author edits or deletes their own post; the System updates/removes the record.

**Exceptions**
- **E1. Empty/over-length content:** The System blocks submission with an inline error.
- **E2. Not a member:** Non-members cannot post (403); the composer is hidden.

---

### UC-12 — Add Subject & Enter/Upload Syllabus

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-12 |
| **Name** | Add Subject & Enter/Upload Syllabus |
| **Actor(s)** | Student (primary), System |
| **Description** | A Student adds a subject they are studying and provides its syllabus, either by typing/pasting the content or uploading a file, to be broken down into weekly topics. |
| **Preconditions** | The user is logged in. |
| **Postconditions** | A `Subjects` record (if new) and a `Syllabus` record are created and associated with the user, ready for topic generation (UC-13). |
| **Priority** | High |

**Main Success Scenario**
1. The Student opens "My Subjects" and selects "Add Subject".
2. The Student enters the subject name, code, and semester.
3. The Student enters or pastes the syllabus text, **or** uploads a syllabus file.
4. The Student sets the course duration (number of weeks).
5. The Student submits.
6. The System validates and creates the `Subjects` record (if not existing) and a linked `Syllabus` record.
7. The System offers to auto-generate weekly topics (links to UC-13).

**Alternative Flows**
- **3a. File upload:** The System parses the uploaded file (e.g., PDF/text) and extracts syllabus content into the `Syllabus` record.
- **2a. Existing subject:** The Student selects an existing subject and only adds/updates its syllabus.

**Exceptions**
- **E1. Unsupported file type / parse failure:** The System asks the Student to paste the text manually.
- **E2. Validation failure:** Inline errors; nothing persisted.

---

### UC-13 — Auto-Generate Weekly Topics

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-13 |
| **Name** | Auto-Generate Weekly Topics |
| **Actor(s)** | System (primary), Student |
| **Description** | The System breaks a subject's syllabus into a sequence of weekly topics, creating a study plan the Student can then track. |
| **Preconditions** | A `Syllabus` record with content and a course duration exists for the subject. |
| **Postconditions** | `Topics` records are created (one or more per week) and linked to the subject; corresponding `Progress` baseline records are initialized. |
| **Priority** | High |

**Main Success Scenario**
1. The Student selects "Generate Weekly Topics" for a subject (or this is triggered automatically after UC-12).
2. The **System** parses the `Syllabus` content into discrete topic units.
3. The **System** distributes the topics across the configured number of weeks.
4. The System creates `Topics` records (week number, title, order, completion = false).
5. The System initializes `Progress` to 0% for the subject.
6. The System displays the generated weekly topic plan for review.

**Alternative Flows**
- **6a. Manual adjustment:** The Student edits, reorders, merges, splits, adds, or removes generated topics; the System updates the `Topics` records.
- **3a. Custom pacing:** The Student specifies topics-per-week; the System distributes accordingly.

**Exceptions**
- **E1. Empty/unparseable syllabus:** The System falls back to letting the Student add topics manually.
- **E2. Duration mismatch:** If there are more topics than weeks, the System packs multiple topics per week and warns the Student.

---

### UC-14 — Mark Topic Complete / Track Progress

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-14 |
| **Name** | Mark Topic Complete / Track Progress |
| **Actor(s)** | Student (primary), System |
| **Description** | A Student marks topics as completed; the System recomputes progress percentages, progress bars, weekly targets, and the study streak. |
| **Preconditions** | The user is logged in; `Topics` exist for the subject. |
| **Postconditions** | The `Topics.completed` flag is updated; `Progress` percentage, weekly-target status, and study streak are recalculated and stored. |
| **Priority** | High |

**Main Success Scenario**
1. The Student opens a subject's progress/topics view.
2. The System displays topics grouped by week with completion checkboxes and a progress bar.
3. The Student marks a topic as complete (or un-completes it).
4. The System updates the `Topics` record.
5. The **System** recomputes the subject's completion percentage and updates the `Progress` record.
6. The **System** updates the weekly target status and the study streak (consecutive active days).
7. The System re-renders the updated progress bar and stats.

**Alternative Flows**
- **3a. Bulk complete a week:** The Student marks an entire week complete; the System updates all that week's topics at once.
- **6a. Streak milestone reached:** The System sends a congratulatory notification (UC-17).

**Exceptions**
- **E1. Concurrent update:** If the topic was changed elsewhere, the System reconciles to the latest state and refreshes the view.
- **E2. Unauthorized:** Expired JWT → 401 and redirect to Login.

---

### UC-15 — Add Task & Deadline (Planner)

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-15 |
| **Name** | Add Task & Deadline (Planner) |
| **Actor(s)** | Student (primary), System |
| **Description** | A Student creates study tasks with deadlines in the planner and views them in weekly/monthly views; the System can issue reminders. |
| **Preconditions** | The user is logged in. |
| **Postconditions** | A `Tasks` record is created and appears in the planner views; reminder notifications may be scheduled. |
| **Priority** | High |

**Main Success Scenario**
1. The Student opens the Study Planner.
2. The Student selects "Add Task".
3. The Student enters a task title, optional subject/topic link, due date/time, and priority.
4. The Student submits.
5. The System validates and creates a `Tasks` record.
6. The **System** schedules a reminder notification ahead of the deadline (UC-17).
7. The System displays the task in the weekly/monthly planner view.

**Alternative Flows**
- **1a. Switch views:** The Student toggles between weekly and monthly views; the System renders tasks accordingly.
- **3a. Recurring task:** The Student marks the task recurring; the System creates repeating instances.
- **7a. Complete/edit/delete task:** The Student updates a task's status or details; the System updates the `Tasks` record.

**Exceptions**
- **E1. Past deadline:** The System warns when a due date is in the past but allows it (e.g., backlog).
- **E2. Validation failure:** Inline errors; no task created.

---

### UC-16 — View Dashboard

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-16 |
| **Name** | View Dashboard |
| **Actor(s)** | Student (primary), System |
| **Description** | The Student sees a consolidated overview: their groups, upcoming tasks/deadlines, progress per subject, study streak, recommended groups, and recent notifications. |
| **Preconditions** | The user is logged in. |
| **Postconditions** | Aggregated, read-only data is displayed. No data is mutated. |
| **Priority** | Medium |

**Main Success Scenario**
1. The Student logs in or navigates to the Dashboard.
2. The **System** aggregates the Student's groups, progress (`Progress`/`Topics`), upcoming `Tasks`, study streak, and unread `Notifications`.
3. The System also pulls top group recommendations (from UC-05).
4. The System renders dashboard cards/widgets with the aggregated data.
5. The Student selects any widget to navigate to the related feature (groups, planner, progress, etc.).

**Alternative Flows**
- **2a. New user with little data:** The System shows onboarding prompts (complete profile, add a subject, find a group).

**Exceptions**
- **E1. Partial data load failure:** The System renders available widgets and shows a non-blocking error for any widget that failed to load.
- **E2. Unauthorized:** Expired JWT → 401 and redirect to Login.

---

### UC-17 — Receive Notifications

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-17 |
| **Name** | Receive Notifications |
| **Actor(s)** | Student (primary), System |
| **Description** | The Student receives and reviews system-generated notifications (join requests, request decisions, new discussion posts, task reminders, streak milestones, member changes). |
| **Preconditions** | The user is logged in; notification-generating events have occurred. |
| **Postconditions** | `Notifications` records are displayed; viewed notifications are marked read. |
| **Priority** | Medium |

**Main Success Scenario**
1. An event occurs (e.g., a join request is sent, a task reminder is due).
2. The **System** creates a `Notifications` record for the relevant user.
3. The System surfaces an unread-count badge in the UI.
4. The Student opens the notifications panel.
5. The System lists notifications newest-first.
6. The Student reads a notification; the System marks it read.
7. The Student optionally selects a notification to navigate to its related context (group, task, request).

**Alternative Flows**
- **6a. Mark all as read:** The Student clears all unread notifications at once.
- **7a. Dismiss/delete:** The Student deletes a notification; the System removes the record.

**Exceptions**
- **E1. Delivery failure:** If real-time push fails, the notification still persists and is shown on the next poll/page load.
- **E2. Unauthorized:** Expired JWT → 401 and redirect to Login.

---

## 4. Relationships Overview

- **«include»** — UC-05 (Find/Match), UC-13 (Auto-Generate Topics), UC-14 (Track Progress), UC-15 (Planner), UC-16 (Dashboard) all **include** UC-17 (Receive Notifications) where they emit notifications.
- **«include»** — UC-12 (Add Subject & Syllabus) **includes** UC-13 (Auto-Generate Weekly Topics) when generation is triggered automatically.
- **«extend»** — UC-07 (Join Request) is **extended** by UC-08 (Accept/Reject) on the admin side.
- **Generalization** — Group Admin **is a** Student; all Student use cases are available to Group Admins.

> The full graphical relationships are specified in `04-use-case-diagram.md`.
