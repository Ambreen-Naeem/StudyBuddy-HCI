# StudyBuddy — Heuristic Evaluation Report

**Method:** Nielsen's Heuristic Evaluation
**Object evaluated:** StudyBuddy React frontend (`frontend/src`) + observable API behaviour
**Evaluators:** HCI evaluation (single-evaluator walkthrough, code-grounded)
**Date:** 2026-06-13
**Related documents:** [09-hci-principles.md](09-hci-principles.md) (design intent) · [10-testing.md](10-testing.md) (test plan & SUS)

---

## 1. Method & Scoring

This is a **heuristic evaluation**: expert inspection of the interface against Nielsen's 10 usability heuristics. Each identified problem is rated for **severity** on Nielsen's standard 0–4 scale, which combines *frequency*, *impact*, and *persistence*:

| Severity | Meaning | Action |
|:---:|---|---|
| **0** | Not a usability problem | — |
| **1** | Cosmetic — fix only if time permits | Backlog |
| **2** | Minor — low priority | Should fix |
| **3** | Major — high priority, frustrates users | Must fix |
| **4** | Catastrophic — must fix before release | Blocker |

Each heuristic also receives an overall **compliance rating** (★ out of 5) summarising how well the current build satisfies it.

> **Note on evidence.** Findings are grounded in the actual source. File references (e.g. `Modal.jsx`, `GroupDetail.jsx`) point to the implementing code so each finding is verifiable and each fix is locatable.

---

## 2. Scorecard (at a glance)

| # | Heuristic | Compliance | Issues found (by severity) |
|:---:|---|:---:|---|
| 1 | Visibility of system status | ★★★★☆ | 1×S3, 2×S2, 2×S1 |
| 2 | Match between system & real world | ★★★★☆ | 2×S2, 3×S1 |
| 3 | User control & freedom | ★★★☆☆ | 1×S3, 3×S2, 2×S1 |
| 4 | Consistency & standards | ★★★★☆ | 1×S3, 3×S2, 2×S1 |
| 5 | Error prevention | ★★★☆☆ | 1×S3, 3×S2, 2×S1 |
| 6 | Recognition rather than recall | ★★★★☆ | 2×S2, 3×S1 |
| 7 | Flexibility & efficiency of use | ★★★★☆ | 2×S2, 3×S1 |
| 8 | Aesthetic & minimalist design | ★★★★☆ | 3×S1 |
| 9 | Help users recover from errors | ★★★☆☆ | 1×S3, 3×S2, 1×S1 |
| 10 | Help & documentation | ★★☆☆☆ | 1×S3, 2×S2, 1×S1 |

**Aggregate:** 0 catastrophic (S4), **6 major (S3)**, **24 minor (S2)**, **24 cosmetic (S1)**.
**Overall product usability:** **Good** — strong, accessible foundation; no blockers. The recurring themes that hold it back from *excellent* are **(a) thin help/onboarding**, **(b) inconsistent confirmation of destructive actions**, and **(c) submit-time-only validation**.

---

## 3. Findings by Heuristic

Each heuristic lists what the build does **well** (✔) and the **problems** (▲) with severity and a concrete recommendation.

---

### H1 — Visibility of System Status ★★★★☆

**What works**
- ✔ `Spinner.jsx` (`role="status"` + sr-only label) gives loading feedback on every data page.
- ✔ `Toast/ToastContext.jsx` confirms every API action via an `aria-live="polite"` region — success/error always announced.
- ✔ `ProgressBar.jsx` exposes `role="progressbar"` with `aria-valuenow/min/max` **and** shows the percentage as text, so status isn't conveyed by fill width alone.
- ✔ Disabled/busy buttons (`Button.jsx` `disabled:opacity-60`) show in-flight submissions; `FindGroups.jsx` flips a group to a "Request sent" badge.

**Problems**

| ID | Finding | Location | Sev |
|---|---|---|:---:|
| H1-1 | **No session-expiry warning.** On a 401 the app silently drops the token and redirects to `/login`; the user loses unsaved work with no "Your session expired" message. | `AuthContext.jsx`, `client.js` | **3** |
| H1-2 | No page-level skeletons — initial Dashboard/GroupDetail load shows a full-screen spinner then a content jump. | `Dashboard.jsx`, `GroupDetail.jsx` | 2 |
| H1-3 | No unsaved-changes (dirty-state) indicator on Profile/Subjects/Planner forms; navigating away is silent. | `Profile.jsx`, `Planner.jsx` | 2 |
| H1-4 | No global activity indicator in the navbar for background work; only per-button feedback. | `Navbar.jsx` | 1 |
| H1-5 | No breadcrumb trail on deep pages (only a back link). | `SyllabusDetail.jsx`, `GroupDetail.jsx` | 1 |

**Recommendations:** add a toast + redirect-reason on session expiry; add `localStorage` draft + `beforeunload`/route-guard for dirty forms; introduce simple skeleton blocks.

---

### H2 — Match Between System and the Real World ★★★★☆

**What works**
- ✔ Domain language throughout — *Subjects, Semester, Skill level, Syllabus, Topics, Study groups*. No system jargon.
- ✔ Mental-model-aligned flows: Dashboard overview, weekly/monthly Planner toggle, forum-style discussion (author + timestamp + nested replies in `GroupDetail.jsx`).
- ✔ Job-search-style "75% match" badge in `FindGroups.jsx` is instantly legible.

**Problems**

| ID | Finding | Location | Sev |
|---|---|---|:---:|
| H2-1 | **"Day streak" and "Weekly target" are unexplained.** Dashboard shows "🔥 Day streak: 42" and ProgressTracker shows "🎯 Weekly target: 5" with no definition or source. | `Dashboard.jsx`, `ProgressTracker.jsx` | 2 |
| H2-2 | **"Match score" algorithm is opaque** — no legend distinguishing *Matched* vs *Recommended* groups or what the % weighs. | `FindGroups.jsx` | 2 |
| H2-3 | Overdue logic marks a task overdue at *midnight* of its due date rather than end-of-day, so a task due "today" reads as overdue all day. | `Planner.jsx` `isOverdue()` | 1 |
| H2-4 | "Mark all as read" doesn't state scope (this page vs all unread). | `Notifications.jsx` | 1 |
| H2-5 | "Recurrence" field is sent to the API from the weekly/monthly toggle but the label implies repeating tasks, which it doesn't create. | `Planner.jsx` | 1 |

**Recommendations:** add info-tooltips (ⓘ) defining streak, weekly target, and match score; treat overdue as `due_date < startOfToday`; rename/clarify the recurrence/view field.

---

### H3 — User Control and Freedom ★★★☆☆

**What works**
- ✔ Explicit "Sign out" always in the navbar; `Esc` closes modals (`Modal.jsx`) and focus is **restored to the trigger** on close.
- ✔ Optimistic topic toggle in `ProgressTracker.jsx` with **rollback on API failure** — instant yet safe.
- ✔ Reply composer and create forms have a **Cancel** path; back links on deep pages and the 404.

**Problems**

| ID | Finding | Location | Sev |
|---|---|---|:---:|
| H3-1 | **No undo for destructive actions.** Deleting a group/task/member is immediate and permanent; only a pre-confirm dialog exists, no post-action undo window. | `GroupDetail.jsx`, `Planner.jsx` | **3** |
| H3-2 | Posts cannot be edited or deleted after submission (typos are permanent). | `GroupDetail.jsx` | 2 |
| H3-3 | Notifications can be marked read but not dismissed/deleted. | `Notifications.jsx` | 2 |
| H3-4 | No bulk actions (multi-select tasks/topics to complete or delete). | `Planner.jsx`, `ProgressTracker.jsx` | 2 |
| H3-5 | Post/reply drafts are lost on reload (no draft persistence). | `GroupDetail.jsx` | 1 |
| H3-6 | No pin/favourite for frequently visited groups. | `GroupList.jsx` | 1 |

**Recommendations:** add a 5-second "Undo" toast after deletes (soft-delete on the backend); allow post edit/delete by the author; allow notification dismissal.

---

### H4 — Consistency and Standards ★★★★☆

**What works**
- ✔ Centralised primitives (`Button`, `Input`, `Card`, `Badge`, `EmptyState`) reused across all pages; `danger` variant always marks destructive actions.
- ✔ Global `:focus-visible { ring-2 ring-primary }` in `index.css` — identical focus ring on every control.
- ✔ Meaning never carried by colour alone — badges pair tone **with** icon + text (supports colour-blind users).

**Problems**

| ID | Finding | Location | Sev |
|---|---|---|:---:|
| H4-1 | **Inconsistent destructive-action safety.** Delete group/task use `ConfirmDialog`, but **removing a member fires immediately with no confirmation.** | `GroupDetail.jsx` | **3** |
| H4-2 | Create flows mix patterns — some open a `Modal`, GroupDetail uses inline UI. | `Subjects.jsx`, `GroupDetail.jsx` | 2 |
| H4-3 | Success actions sometimes show an info-toned toast instead of `success` green. | `Login.jsx`, `Register.jsx` | 2 |
| H4-4 | Link styling varies (text-link vs bordered button) for equivalent navigation. | multiple pages | 2 |
| H4-5 | Some selects are hand-built rather than wrapped by `Input`, so label spacing differs. | `Planner.jsx` | 1 |
| H4-6 | Badge tone choices (primary vs secondary) feel arbitrary across subject/skill badges. | `Badge.jsx` consumers | 1 |

**Recommendation (high value):** route **every** destructive action through `ConfirmDialog` — H4-1 is the single most important consistency fix.

---

### H5 — Error Prevention ★★★☆☆

**What works**
- ✔ `Register.jsx` validates required fields, email format, password length, and confirmation **before** calling the API.
- ✔ `ConfirmDialog` guards group/task deletion; `SyllabusDetail.jsx` disables "Save plan" when zero topics parsed; Planner warns on missing title/date.
- ✔ Token validated on boot; failed notification fetches caught so the navbar never crashes.

**Problems**

| ID | Finding | Location | Sev |
|---|---|---|:---:|
| H5-1 | **Login has no client-side validation** — blank email/password reach the API and only fail server-side. | `Login.jsx` | **3** |
| H5-2 | All validation is submit-time; no inline/real-time feedback (e.g. "email taken", live match check). | `Register.jsx`, `Input.jsx` | 2 |
| H5-3 | No password-strength meter (only static helper text). | `Register.jsx` | 2 |
| H5-4 | Member removal has no confirmation (see H4-1) — easy mis-click. | `GroupDetail.jsx` | 2 |
| H5-5 | "Topics per week" accepts cleared/out-of-range values despite min/max. | `SyllabusDetail.jsx` | 1 |
| H5-6 | No email verification step — typo'd address locks the account out. | `Register.jsx` | 1 |

**Recommendations:** add the same required-field guard used in Register to Login; add a lightweight strength meter; clamp numeric inputs on blur.

---

### H6 — Recognition Rather Than Recall ★★★★☆

**What works**
- ✔ Persistent 8-item sidebar (drawer on mobile) — every destination one click away, nothing to memorise.
- ✔ Example-rich placeholders ("you@university.edu", "Data Structures", "Spring 2026") model expected input.
- ✔ **Live weekly-breakdown preview** in `SyllabusDetail.jsx` shows the result as the user types; member list shows initials + name + admin badge.

**Problems**

| ID | Finding | Location | Sev |
|---|---|---|:---:|
| H6-1 | Match/streak/weekly-target meanings must be recalled, not recognised (no on-screen explanation). | `Dashboard.jsx`, `FindGroups.jsx` | 2 |
| H6-2 | `FindGroups` doesn't remember the last-used filters; users re-enter subject + semester each visit. | `FindGroups.jsx` | 2 |
| H6-3 | Skill levels (Beginner/Intermediate/Advanced) have no description of what each implies. | `Register.jsx`, `Profile.jsx` | 1 |
| H6-4 | No subject/semester autocomplete (`datalist`/combobox) to pick from known values. | `FindGroups.jsx` | 1 |
| H6-5 | Icon-only controls lack a *visible* tooltip for mouse users (accessible label exists). | `Navbar.jsx`, `NotificationBell.jsx` | 1 |

**Recommendations:** persist filters in `localStorage`; add tooltips and a `datalist` of the user's own subjects.

---

### H7 — Flexibility and Efficiency of Use ★★★★☆

**What works**
- ✔ Fully keyboard-operable: real `<button>`/`<a>` elements, natural tab order, **focus trap with Tab/Shift+Tab wrapping** in `Modal.jsx`, `Esc` to close.
- ✔ **Skip link** in `Layout.jsx` lets keyboard users bypass nav; native `<input type="date">` and checkboxes are fast for power users.
- ✔ Sidebar auto-closes after mobile navigation.

**Problems**

| ID | Finding | Location | Sev |
|---|---|---|:---:|
| H7-1 | Notification updates poll every 30 s — no real-time push; up to 30 s latency. | `NotificationBell.jsx` | 2 |
| H7-2 | No keyboard-shortcut layer or discoverable shortcut list for frequent users. | global | 2 |
| H7-3 | No batch task creation / paste-multiple. | `Planner.jsx` | 1 |
| H7-4 | No export (PDF/CSV) of progress, tasks, or discussions. | global | 1 |
| H7-5 | No dark mode for late-night studying. | `index.css`, theme | 1 |

**Recommendations:** add a small shortcut map (e.g. `g d` → Dashboard) and a "?" overlay; consider SSE/WebSocket for notifications later.

---

### H8 — Aesthetic and Minimalist Design ★★★★☆

**What works**
- ✔ Deliberate token-driven palette, generous whitespace (`space-y-6`, consistent card padding), uniform `rounded-xl` + soft shadows.
- ✔ Lists cap visible items (`slice(0,6)` + "View more") to limit cognitive load; clear type hierarchy.

**Problems**

| ID | Finding | Location | Sev |
|---|---|---|:---:|
| H8-1 | Heavy emoji use as functional icons (＋ 🔍 × ⚠ ✓ 🗑) can read as cluttered at scale and renders inconsistently across OSes. | `Button.jsx`, `Badge.jsx` | 1 |
| H8-2 | Many coloured avatar-initial chips create visual noise on member/profile pages. | `GroupDetail.jsx`, `Profile.jsx` | 1 |
| H8-3 | Uniform card sizing gives no visual emphasis to primary/owned items. | `GroupList.jsx`, `Subjects.jsx` | 1 |

**Recommendation:** swap emoji for a lightweight SVG icon set (e.g. Lucide) for visual consistency; that single change resolves H8-1.

---

### H9 — Help Users Recognize, Diagnose, and Recover from Errors ★★★☆☆

**What works**
- ✔ Inline field errors in `Input.jsx` (red text + ⚠ icon + `aria-invalid` + `aria-describedby`); form-level error summaries use `role="alert"`.
- ✔ Every failed API call surfaces a contextual toast; pages define **fallback data** so a failed fetch renders placeholders instead of crashing.
- ✔ Friendly `NotFound.jsx` 404 with a route home; actionable empty states.

**Problems**

| ID | Finding | Location | Sev |
|---|---|---|:---:|
| H9-1 | **No React error boundary** — an uncaught render error takes the page down with no recovery UI. | app root | **3** |
| H9-2 | Login error is generic ("Invalid email or password") and not field-specific; "Passwords do not match" highlights only the confirm field. | `Login.jsx`, `Register.jsx` | 2 |
| H9-3 | Network timeout (15 s) surfaces as a generic "Something went wrong" with no retry affordance. | `useFetch.js`, `client.js` | 2 |
| H9-4 | "Request sent" doesn't tell the user what happens next ("awaiting admin approval"). | `FindGroups.jsx` | 2 |
| H9-5 | Possible UI/backend rule mismatch on password policy (UI says only "6+ chars"). | `Register.jsx` | 1 |

**Recommendations:** add a top-level `<ErrorBoundary>` with a recovery screen; add retry buttons to failed fetches; clarify post-action expectations.

---

### H10 — Help and Documentation ★★☆☆☆ *(weakest area)*

**What works**
- ✔ Strong *contextual* help — helper text (e.g. SyllabusDetail: "One topic per line. We'll lay them out into weeks automatically."), example placeholders, and the live preview reduce the need for a manual.
- ✔ Icon-only controls carry `aria-label`s; auth pages carry orienting taglines.

**Problems**

| ID | Finding | Location | Sev |
|---|---|---|:---:|
| H10-1 | **No Help/FAQ page, onboarding tour, or first-run guidance.** New users aren't told the intended path (add subject → add topics → track → join groups). | global | **3** |
| H10-2 | Domain concepts (streak, weekly target, match score, skill levels) are undocumented anywhere in-product. | global | 2 |
| H10-3 | No settings/preferences page for defaults (notification cadence, default skill level). | global | 2 |
| H10-4 | No accessibility statement / keyboard-shortcut help, and no Terms/Privacy links. | auth + footer | 1 |

**Recommendations:** add a lightweight "Getting started" checklist card on the empty Dashboard and a `/help` page; tooltips cover H10-2 cheaply.

---

## 4. Accessibility Cross-Check (supports H1, H4, H6, H7, H9)

**Strong:** semantic landmarks (`nav`/`main`/`header`/`aside` with `aria-label`s); `aria-live` toasts and `role="alert"` error summaries; modal focus trap + restoration + skip link; status conveyed by **icon + text + ARIA**, never colour alone; `prefers-reduced-motion` honoured in `index.css`; decorative emoji `aria-hidden`.

**Gaps to fix:**
| ID | Finding | Location | Sev |
|---|---|---|:---:|
| A11Y-1 | Missing `lang` attribute on the document root. | `index.html` / `main.jsx` | 2 |
| A11Y-2 | Off-canvas sidebar stays in the a11y tree when hidden (`-translate-x-full` but no `aria-hidden`/`inert`) — screen-reader users can tab into an invisible menu. | `Sidebar.jsx` | 2 |
| A11Y-3 | `NotificationBell` dropdown uses `role="menu"` but isn't a true menu widget — mismatched ARIA semantics. | `NotificationBell.jsx` | 1 |

---

## 5. Prioritised Remediation Backlog

Fix in this order — each line is a concrete, locatable change.

**P0 — Major (S3), do first**
1. **H4-1 / H5-4** Route member-removal (and any other unguarded destructive action) through `ConfirmDialog`. *(consistency + error prevention, one fix)*
2. **H3-1** Add an "Undo" toast (soft-delete) after destructive actions.
3. **H5-1** Add client-side required-field validation to `Login.jsx`.
4. **H9-1** Add a top-level React `ErrorBoundary` with a recovery screen.
5. **H1-1** Show a "session expired" toast before the 401 redirect.
6. **H10-1** Add a first-run "Getting started" checklist + a `/help` page.

**P1 — Minor (S2), high leverage**
7. Tooltips defining streak / weekly target / match score (clears H2-1, H2-2, H6-1, H10-2 together).
8. Persist `FindGroups` filters (H6-2). 9. Skeleton loaders (H1-2). 10. Dirty-form guard (H1-3). 11. Field-specific login/password errors + retry on timeout (H9-2, H9-3). 12. Fix `lang` + off-canvas `aria-hidden` (A11Y-1, A11Y-2).

**P2 — Cosmetic (S1), polish**
13. Replace emoji with an SVG icon set (H8-1). 14. End-of-day overdue logic (H2-3). 15. Skill-level descriptions (H6-3). 16. Dark mode (H7-5).

---

## 6. Conclusion

StudyBuddy presents a **mature, accessible interface** with no catastrophic problems: status feedback, consistency primitives, keyboard operability, and error messaging are all well above the level typical of a student project, and the design clearly operationalises the principles documented in [09-hci-principles.md](09-hci-principles.md). The evaluation surfaced **6 major and 24 minor** issues, clustered into three actionable themes — **uniform confirmation of destructive actions, submit-time-only validation, and thin onboarding/help**. Addressing the six **P0** items would raise the weakest heuristics (H5, H9, H10) by roughly a full point each and move the product from *Good* toward *Excellent*. These findings feed directly into the usability test scenarios in [10-testing.md](10-testing.md), where the same flows can be validated with real users and an SUS score.
