# StudyBuddy — Testing & HCI Evaluation

**Document:** 10 — Usability Testing, HCI Evaluation & SUS
**Project:** StudyBuddy — Find Study Partners, Build Better Study Habits
**Course:** Human-Computer Interaction (HCI)
**Date:** 13 June 2026

---

## 1. Purpose of This Document

This document defines how StudyBuddy is evaluated for usability and Human-Computer Interaction quality. It is the operational companion to the design documentation (`/docs/01`–`/docs/09`) and is referenced directly by the final project report (`/docs/11-project-report.md`, Section 7: HCI Evaluation).

It contains five testable instruments:

1. A **Usability Testing Plan** — goals, methodology, participants, environment, metrics, procedure, and consent.
2. A set of **User Testing Scenarios** — concrete, scripted tasks with measurable success criteria.
3. An **HCI Evaluation Checklist** — a heuristic-evaluation instrument covering Nielsen's 10 heuristics plus accessibility (WCAG AA, keyboard, ARIA, colour).
4. The **System Usability Scale (SUS)** — the standard 10-item questionnaire and its scoring procedure.
5. A **Bug/Issue Severity Rubric** and a reusable **Usability-Findings Template**.

Together these allow a single evaluator (or a small evaluation team) to plan a session, run it, record results consistently, and roll the results up into the report.

---

## 2. Usability Testing Plan

### 2.1 Goals

The testing programme has four goals, each tied back to the project objectives in `/docs/01-project-overview.md`:

1. **Validate learnability.** Can a first-time student, with no training, complete the core journeys — register, build a profile, find and join a group, structure a syllabus, track progress, and plan a task — without external help?
2. **Validate efficiency.** Can returning students complete frequent tasks (mark a topic complete, add a planner task, post to a discussion board) quickly and with few errors?
3. **Validate satisfaction.** Do students rate the system as usable, measured quantitatively via the System Usability Scale (target mean SUS ≥ 75, "good" to "excellent" on the adjective scale)?
4. **Surface defects and friction.** Identify usability problems, accessibility gaps, and functional bugs, ranked by severity, so they can be prioritised and fixed.

### 2.2 Methodology

StudyBuddy uses a **mixed-methods, two-instrument** approach:

- **Moderated, task-based usability testing.** Each participant works through a fixed set of scenarios (Section 3) while a moderator observes. The method is *think-aloud*: participants verbalise their thoughts as they work, so the moderator captures not just *what* failed but *why*. Sessions are moderated (a facilitator is present, in person or via screen-share) rather than unmoderated, because the small sample benefits from rich qualitative observation and follow-up probing.
- **System Usability Scale (SUS) survey.** Immediately after the tasks, each participant completes the 10-item SUS questionnaire (Section 5). SUS gives a single, comparable, well-validated satisfaction score that can be benchmarked against industry norms.

This pairing is deliberate: task testing yields *diagnostic* data (which screens, which steps, which controls cause trouble), while SUS yields *summative* data (a single number for the report and for tracking across design iterations). A short post-session semi-structured interview (3–4 open questions) supplements both.

The approach follows Nielsen's discount-usability guidance: a small number of representative users (5 is sufficient to expose roughly 80% of usability problems) tested early and iteratively is more valuable than a large, late, one-off study.

### 2.3 Participant Profile

| Attribute | Target |
|---|---|
| Number of participants | 5–8 university students |
| Status | Currently enrolled undergraduates (mix of first-year and senior) |
| Subject mix | At least 3 different degree subjects represented (e.g., CS, Engineering, Business) |
| Tech comfort | Range from low to high self-rated comfort with web apps |
| Prior exposure | None must have used StudyBuddy before |
| Accessibility | Recruit at least 1 participant who relies on keyboard navigation and/or a screen reader where possible, and screen for colour-vision deficiency awareness |
| Devices | Mix of laptop and mobile-web users |

Recruiting 5–8 participants balances coverage against effort. Representativeness (real students, real subjects, varied tech comfort) matters more than raw count.

### 2.4 Test Environment

- **Setting:** Quiet room or video call; one participant and one moderator per session; optional silent note-taker.
- **Hardware:** Participant's own laptop where possible (ecological validity), otherwise a provided laptop (1366×768 minimum) and a mobile device for responsive checks.
- **Software:** Current Chrome/Firefox/Edge; StudyBuddy running against a seeded staging database (pre-populated with subjects, sample groups, and at least one syllabus so matching and discussion features have content).
- **Recording:** Screen + audio recording with consent; moderator timing each task with a stopwatch or screen-capture timestamps.
- **Accounts:** Each participant receives a clean test account; a second seeded "buddy" account exists so group join/approval flows can be exercised end-to-end.

### 2.5 Metrics

| Metric | Definition | How captured | Target |
|---|---|---|---|
| **Task success rate** | % of participants completing a scenario unaided, meeting its success criteria | Moderator marks Pass / Partial / Fail per scenario | ≥ 90% Pass on core tasks |
| **Time on task** | Seconds from task start to success criterion met | Stopwatch / screen timestamps | Within each scenario's Max Time |
| **Error rate** | Count of wrong actions, wrong paths, or recoveries per task | Tally during observation | ≤ 2 errors/task average |
| **Assists** | Number of moderator hints required | Tally | 0 on core tasks |
| **SUS score** | 0–100 composite from the 10-item survey | Post-session questionnaire | Mean ≥ 75 |
| **Severity-weighted findings** | Issues logged and rated 1–4 (Section 6) | Findings log | No open Severity-1 issues |

### 2.6 Procedure

Each session runs ~45 minutes:

1. **Welcome & consent (5 min).** Explain purpose, that the *system* is being tested and not the participant, that they may stop at any time, and obtain recording consent (Section 2.7).
2. **Pre-test (3 min).** Capture background: subject, year, self-rated tech comfort, assistive-tech use.
3. **Warm-up (2 min).** A trivial orientation task (e.g., "log in") to settle nerves and confirm the setup.
4. **Scenario tasks (25 min).** Present scenarios from Section 3 one at a time, in order. Participant thinks aloud; moderator times, observes, and tallies errors/assists without coaching. Move on at Max Time even if incomplete (mark Fail/Partial).
5. **SUS survey (4 min).** Participant completes the 10-item SUS (Section 5) independently.
6. **Debrief interview (5 min).** Open questions: most/least useful feature, anything confusing, what they'd change, would they use it.
7. **Close (1 min).** Thank participant; log findings immediately while fresh.

### 2.7 Consent Note

> *Participation is voluntary and may be ended at any time without penalty. Sessions are audio/screen-recorded solely to analyse the usability of StudyBuddy; recordings and notes are anonymised, stored securely, used only for this academic HCI project, and deleted after the project is graded. No personal academic records are collected. By signing/clicking "I agree", the participant confirms they have read this note and consent to recording.*

A signed (or e-signed) consent line is collected before recording begins.

---

## 3. User Testing Scenarios

Scenarios are presented to participants as goals, not click-by-click instructions ("Find a study group for one of your subjects and join it" — not "click the Groups tab, then…"). The **Steps** column below is the moderator's expected path for scoring, not a script read to the participant. Tasks progress from account setup through every major feature.

| # | Scenario | Task (given to participant) | Expected Steps (moderator reference) | Success Criteria | Max Time |
|---|---|---|---|---|---|
| **S1** | First-time registration & profile | "You're a new student. Create an account and complete your profile so the app knows your subjects and availability." | Open Register → enter name/email/password → verify/login → open Profile → add university, semester, ≥1 subject, skill level, availability/schedule → save | Account created; profile saved with name, semester, ≥1 subject, skill level, and availability; confirmation shown | 4 min |
| **S2** | Add a subject | "Add the subject you most want help with to your account." | Dashboard/Subjects → Add Subject → choose/enter subject + semester + skill level → save | Subject appears in the user's subject list and on the dashboard | 2 min |
| **S3** | Generate weekly topics from a syllabus | "Break your new subject's syllabus into weekly topics." | Open the subject → Syllabus → paste/enter syllabus or trigger breakdown → confirm generated weekly topics (Week 1…N) | Subject shows an ordered list of weekly topics; Week 1 topic is visible | 4 min |
| **S4** | Track progress: mark a topic complete | "Mark Week 1 of that subject as complete and check how it changed your progress." | Open subject → Topics/Progress → mark Week 1 complete → observe progress bar/percent update | Week 1 shows complete; progress percentage and bar increase accordingly; change is visible without reload confusion | 2 min |
| **S5** | Find & join a study group | "Find a study group for one of your subjects and ask to join it." | Groups → browse/Recommended → filter by subject → open a group → Request to Join → confirmation | A join request is sent (or membership granted); the user sees pending/joined status and feedback | 3 min |
| **S6** | Create a study group & manage a request | "Create your own study group for your subject, then approve a pending request to join it." | Groups → Create Group → name, subject, semester, level, schedule → save → open Admin/Requests → approve the seeded buddy's pending request | Group created with the user as admin; pending join request approved; new member appears in the member list | 4 min |
| **S7** | Use the group discussion board | "Post a message to your group's discussion board asking when everyone is free." | Open group → Discussion → compose post → submit | Post appears in the discussion thread attributed to the user, in correct order | 2 min |
| **S8** | Create a planner task with a deadline | "Add a study task with a deadline of next Friday to your planner." | Planner → Add Task → title, subject (optional), due date = next Friday, reminder → save → confirm it appears in weekly view | Task saved with correct deadline; visible in weekly view; reminder set if offered | 3 min |
| **S9** | Switch planner views & edit a task | "Check your task in the monthly view, then move its deadline one day later." | Planner → toggle weekly→monthly → open task → change due date +1 day → save | Task visible in monthly view; deadline updated and reflected in both views | 3 min |
| **S10** | Read & act on a notification | "You have a new notification — find it and open whatever it refers to." | Bell/Notifications → open list → click the relevant notification → land on the correct group/task/request | Notification opened; user is taken to the correct destination (group, request, or task) | 2 min |
| **S11** | Dashboard comprehension | "Without clicking anything, tell me what's due soon, your overall progress, and what groups are recommended for you." | Read dashboard: upcoming tasks, progress stats/streak, recommended groups | Participant correctly reads ≥3 of: next deadline, a progress figure, study streak, a recommended group | 2 min |
| **S12** | Keyboard-only navigation (accessibility) | "Using only the keyboard — no mouse — move from the dashboard to the planner and open the Add Task form." | Tab/Shift-Tab/Enter through nav → reach Planner → open Add Task; focus visible throughout | Task achieved with keyboard only; focus indicator always visible; no keyboard trap | 3 min |

**Scoring per scenario:** Pass (criteria met unaided, within Max Time), Partial (criteria met but over time, with errors, or with ≥1 assist), Fail (criteria not met). Record time, error count, and assist count for every scenario regardless of outcome.

---

## 4. HCI Evaluation Checklist (Heuristic Evaluation)

This checklist is completed by an evaluator inspecting the interface against Nielsen's 10 usability heuristics and an accessibility block. Each item is rated **Pass / Fail / N-A**, with a **Severity** (Section 6) for any Fail and free-text **Notes**. The same checklist is reused across design iterations to track regressions and fixes.

### 4.1 Nielsen's 10 Heuristics

#### H1 — Visibility of System Status
| # | Checkpoint | Pass/Fail | Sev | Notes |
|---|---|---|---|---|
| 1.1 | Every action (save, join, post, complete) gives immediate visible feedback | | | |
| 1.2 | Loading/processing states are shown (spinners/skeletons), never a frozen screen | | | |
| 1.3 | Current location is clear (active nav item, breadcrumbs/headings) | | | |
| 1.4 | Progress bars, percentages, and streak reflect the true current state | | | |
| 1.5 | Notification badge accurately shows unread count | | | |

#### H2 — Match Between System and the Real World
| # | Checkpoint | Pass/Fail | Sev | Notes |
|---|---|---|---|---|
| 2.1 | Language is student-facing (Subject, Semester, Topic, Group), not DB/jargon | | | |
| 2.2 | Icons match real-world meaning (bell = notifications, calendar = planner) | | | |
| 2.3 | Dates/times shown in natural, local format | | | |
| 2.4 | Information appears in a logical, expected order (weeks ascending, deadlines soonest-first) | | | |

#### H3 — User Control and Freedom
| # | Checkpoint | Pass/Fail | Sev | Notes |
|---|---|---|---|---|
| 3.1 | Clear way to cancel/back out of any dialog or multi-step flow | | | |
| 3.2 | Destructive actions (leave group, delete task) are reversible or confirmed | | | |
| 3.3 | Users can edit profile, subjects, tasks, and topics after creation | | | |
| 3.4 | Logout is always reachable | | | |

#### H4 — Consistency and Standards
| # | Checkpoint | Pass/Fail | Sev | Notes |
|---|---|---|---|---|
| 4.1 | Buttons, colours, and components are consistent across all screens (design system) | | | |
| 4.2 | Primary action is always the visually dominant button | | | |
| 4.3 | Terminology is consistent (one word per concept throughout) | | | |
| 4.4 | Navigation placement is stable across pages | | | |

#### H5 — Error Prevention
| # | Checkpoint | Pass/Fail | Sev | Notes |
|---|---|---|---|---|
| 5.1 | Required fields validated inline before submission | | | |
| 5.2 | Date pickers prevent impossible deadlines (e.g., past dates where inappropriate) | | | |
| 5.3 | Duplicate joins / duplicate subjects are prevented | | | |
| 5.4 | Confirmation requested for irreversible actions | | | |

#### H6 — Recognition Rather Than Recall
| # | Checkpoint | Pass/Fail | Sev | Notes |
|---|---|---|---|---|
| 6.1 | Subjects/groups selectable from lists rather than typed from memory | | | |
| 6.2 | Recently used / recommended items surfaced to reduce recall | | | |
| 6.3 | Form fields show hints/placeholders and retain context | | | |
| 6.4 | Dashboard surfaces what to do next without the user remembering | | | |

#### H7 — Flexibility and Efficiency of Use
| # | Checkpoint | Pass/Fail | Sev | Notes |
|---|---|---|---|---|
| 7.1 | Frequent actions reachable in ≤2 clicks from dashboard | | | |
| 7.2 | Weekly/monthly planner toggle supports different working styles | | | |
| 7.3 | Filters/search available for groups and subjects | | | |
| 7.4 | Keyboard shortcuts or quick-add available for power users (where applicable) | | | |

#### H8 — Aesthetic and Minimalist Design
| # | Checkpoint | Pass/Fail | Sev | Notes |
|---|---|---|---|---|
| 8.1 | Screens show only relevant information; no clutter | | | |
| 8.2 | Visual hierarchy guides the eye to the primary content | | | |
| 8.3 | Whitespace and grouping reduce cognitive load | | | |
| 8.4 | Empty states are helpful, not blank | | | |

#### H9 — Help Users Recognise, Diagnose, and Recover from Errors
| # | Checkpoint | Pass/Fail | Sev | Notes |
|---|---|---|---|---|
| 9.1 | Error messages are in plain language, not codes | | | |
| 9.2 | Errors state the cause and a clear remedy | | | |
| 9.3 | Errors are shown next to the offending field | | | |
| 9.4 | Network/server failures degrade gracefully with retry guidance | | | |

#### H10 — Help and Documentation
| # | Checkpoint | Pass/Fail | Sev | Notes |
|---|---|---|---|---|
| 10.1 | Onboarding/first-run guidance is present | | | |
| 10.2 | Contextual help/tooltips exist for non-obvious features (matching, streaks) | | | |
| 10.3 | Help is searchable/reachable without leaving the task | | | |

### 4.2 Accessibility (WCAG 2.1 AA, Keyboard, ARIA, Colour)

| # | Checkpoint | Pass/Fail | Sev | Notes |
|---|---|---|---|---|
| A1 | All interactive elements reachable and operable by keyboard alone | | | |
| A2 | Visible focus indicator on every focusable element | | | |
| A3 | No keyboard traps; logical tab order matches visual order | | | |
| A4 | Text contrast ≥ 4.5:1 (normal) / 3:1 (large); UI components ≥ 3:1 | | | |
| A5 | Colour is never the *only* means of conveying information (status uses icon+text too) | | | |
| A6 | Palette is colour-blind friendly (deuteranopia/protanopia safe) | | | |
| A7 | All images/icons have alt text or `aria-label`; decorative images hidden | | | |
| A8 | Form inputs have associated `<label>`s; errors linked via `aria-describedby` | | | |
| A9 | Landmarks/headings structure each page (`main`, `nav`, h1→h2→h3 order) | | | |
| A10 | Dynamic updates (progress, notifications) announced via `aria-live` | | | |
| A11 | Touch/click targets ≥ 44×44px; spacing prevents mis-taps | | | |
| A12 | Layout reflows to mobile width without horizontal scroll or loss of content | | | |
| A13 | Respects reduced-motion preference; no content flashes >3×/sec | | | |
| A14 | Page language set (`lang`); zoom to 200% does not break layout | | | |

---

## 5. System Usability Scale (SUS)

The SUS is a 10-item attitude questionnaire scored 1 (Strongly disagree) to 5 (Strongly agree). Odd items are positive, even items negative; this alternation discourages acquiescence bias.

### 5.1 Questionnaire

| # | Statement | SD 1 | 2 | 3 | 4 | SA 5 |
|---|---|:--:|:--:|:--:|:--:|:--:|
| 1 | I think that I would like to use StudyBuddy frequently. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 2 | I found StudyBuddy unnecessarily complex. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3 | I thought StudyBuddy was easy to use. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 4 | I think that I would need the support of a technical person to be able to use StudyBuddy. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 5 | I found the various functions in StudyBuddy were well integrated. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 6 | I thought there was too much inconsistency in StudyBuddy. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 7 | I would imagine that most people would learn to use StudyBuddy very quickly. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 8 | I found StudyBuddy very cumbersome to use. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 9 | I felt very confident using StudyBuddy. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 10 | I needed to learn a lot of things before I could get going with StudyBuddy. | ☐ | ☐ | ☐ | ☐ | ☐ |

### 5.2 Scoring Instructions

1. **Odd items (1,3,5,7,9):** subtract 1 from the chosen value → contribution = (response − 1).
2. **Even items (2,4,6,8,10):** subtract the chosen value from 5 → contribution = (5 − response).
3. **Sum** all 10 contributions (range 0–40).
4. **Multiply by 2.5** → final SUS score (range 0–100).
5. **Average** the per-participant scores for the study's overall SUS.

> **Worked example:** odd responses 4,4,5,4,4 → contributions 3,3,4,3,3 = 16. Even responses 2,1,2,1,2 → contributions 3,4,3,4,3 = 17. Total = 33 × 2.5 = **82.5**.

### 5.3 Interpretation

| SUS score | Grade | Adjective | Interpretation |
|---|---|---|---|
| > 80.3 | A | Excellent | Strongly usable; promoters likely |
| 68 – 80.3 | B/C | Good | Above the 68 average; minor polish |
| 68 | C | OK / Average | Industry mean benchmark |
| 51 – 67 | D | Poor | Notable usability problems |
| < 51 | F | Awful | Serious rework required |

**Project target: mean SUS ≥ 75** (solidly "Good", approaching "Excellent").

---

## 6. Bug / Issue Severity Rubric

Every finding (from heuristic evaluation or task testing) is assigned a severity. Severity blends *impact* (how badly it hurts the user) with *frequency* (how often it occurs).

| Severity | Label | Definition | Example | Action |
|---|---|---|---|---|
| **S1** | Critical / Blocker | Prevents task completion or causes data loss; no workaround | Join-request button does nothing; progress resets on reload | Must fix before release |
| **S2** | Major | Task completable but with serious difficulty/error; frequent | Deadline saves to wrong day; confusing matching results | Fix before release |
| **S3** | Minor | Causes hesitation/inefficiency; workaround exists | Inconsistent button label; weak empty state | Fix if time allows |
| **S4** | Cosmetic | Aesthetic/polish only; no functional impact | Minor spacing/alignment; tooltip typo | Backlog |

Accessibility failures are rated on the same scale, but any WCAG AA blocker that excludes assistive-tech users (e.g., keyboard trap, unlabelled control on a core flow) is treated as **S1/S2 regardless of cosmetic appearance**.

---

## 7. Usability-Findings Template

One row per finding; keep a running log during and after each session.

| Field | Description |
|---|---|
| **Finding ID** | F-001, F-002, … |
| **Date / Session** | Date and participant ID (anonymised, e.g., P3) |
| **Source** | Task test (scenario #) / Heuristic eval (checkpoint #) / Interview / SUS comment |
| **Screen / Feature** | e.g., Planner → Add Task |
| **Heuristic / Criterion** | Which Nielsen heuristic or WCAG item it violates |
| **Description** | What happened, observed objectively |
| **Evidence** | Quote, timestamp, screenshot reference |
| **Severity** | S1–S4 (Section 6) |
| **Frequency** | How many of N participants hit it |
| **Recommendation** | Proposed fix |
| **Status** | Open / In-progress / Fixed / Won't-fix |

### 7.1 Example Findings Log (illustrative)

| ID | Source | Screen | Criterion | Description | Sev | Freq | Recommendation | Status |
|---|---|---|---|---|---|---|---|---|
| F-001 | S5 task | Groups → Join | H1 Visibility | After "Request to Join", no confirmation shown; users clicked twice | S2 | 3/6 | Show toast + change button to "Request sent" | Fixed |
| F-002 | Heuristic A2 | Planner | WCAG A2 | Focus indicator invisible on date picker | S2 | n/a | Add visible focus ring | Fixed |
| F-003 | S3 task | Syllabus | H10 Help | Users unsure what "breakdown" produced | S3 | 2/6 | Add one-line helper text + preview | Open |
| F-004 | SUS comment | Dashboard | H8 Minimalist | "A bit busy at the top" | S4 | 1/6 | Tighten spacing of stat cards | Backlog |

---

## 8. Reporting

Results from this document feed directly into `/docs/11-project-report.md`, **Section 7 (HCI Evaluation)** and **Section 8 (Results & Discussion)**:

- Task success rates, mean time-on-task, and error rates per scenario (Section 3).
- Heuristic-evaluation pass/fail counts and severity distribution (Section 4).
- The mean SUS score with grade (Section 5).
- A prioritised findings list with before/after notes on fixes (Sections 6–7).

This closes the user-centred design loop: evaluate → record → prioritise → fix → re-evaluate.
