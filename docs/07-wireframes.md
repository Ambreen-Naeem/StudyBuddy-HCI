# StudyBuddy — Low-Fidelity Wireframes

> Document 07 · UI/UX Design Documentation
> Project: **StudyBuddy** — a web app helping university students find study partners, form study groups, break syllabi into weekly topics, and track progress.
> Fidelity: **Low** (structure & layout only — no color, typography, or imagery decisions). These wireframes define information architecture, element placement, and behavior. High-fidelity treatment is specified in `08-ui-design.md`.

---

## How to read these wireframes

- Boxes drawn with `┌ ─ ┐ │ └ ┘` represent containers (regions, cards, panels).
- `[ Button ]` = button · `( ) / ( • )` = radio · `[ ] / [x]` = checkbox · `▼` = dropdown · `🔍` = search · `▓▓▓░░` = progress bar · `( A )` = avatar placeholder.
- Each screen documents: **Purpose**, **Key UI elements**, **Interactions**, **Responsive behavior**.
- Global breakpoints referenced: `sm < 640px` (mobile), `md 640–1024px` (tablet), `lg ≥ 1024px` (desktop). Full scale in `08-ui-design.md`.

### Global layout shell (authenticated pages)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ☰  StudyBuddy [logo]        🔍 Search...            🔔(3)   ( A ) Alex ▼   │  ← Top bar
├──────────────┬───────────────────────────────────────────────────────────┤
│  SIDEBAR     │                                                            │
│  ▸ Dashboard │                  MAIN CONTENT AREA                          │
│  ▸ Find Group│                  (page-specific)                           │
│  ▸ My Groups │                                                            │
│  ▸ Syllabus  │                                                            │
│  ▸ Progress  │                                                            │
│  ▸ Planner   │                                                            │
│  ▸ Profile   │                                                            │
│  ─────────── │                                                            │
│  ⚙ Settings  │                                                            │
│  ⎋ Log out   │                                                            │
└──────────────┴───────────────────────────────────────────────────────────┘
```

On `lg` the sidebar is persistent (≈240px). On `md` it collapses to an icon rail (≈72px). On `sm` it becomes an off-canvas drawer toggled by the `☰` hamburger; the top bar search collapses into a search icon.

---

## 1. Login Page

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            StudyBuddy [logo]                               │
│                                                                            │
│        ┌────────────────────────────────────────────────────┐             │
│        │                  Welcome back 👋                     │            │
│        │           Log in to continue studying together       │            │
│        │                                                      │            │
│        │   Email                                              │            │
│        │   ┌────────────────────────────────────────────┐    │            │
│        │   │ you@university.edu                          │    │            │
│        │   └────────────────────────────────────────────┘    │            │
│        │                                                      │            │
│        │   Password                              [show 👁]    │            │
│        │   ┌────────────────────────────────────────────┐    │            │
│        │   │ ••••••••••                                  │    │            │
│        │   └────────────────────────────────────────────┘    │            │
│        │                                                      │            │
│        │   [x] Remember me            Forgot password?        │            │
│        │                                                      │            │
│        │   ┌────────────────────────────────────────────┐    │            │
│        │   │                 Log in                     │    │            │
│        │   └────────────────────────────────────────────┘    │            │
│        │                                                      │            │
│        │   ───────────────  or  ───────────────              │            │
│        │   [  Continue with University SSO  ]                 │            │
│        │   [  Continue with Google          ]                 │            │
│        │                                                      │            │
│        │   New here?  Create an account →                     │            │
│        └────────────────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Purpose:** Authenticate returning users and route them to the dashboard; offer recovery and registration paths.
- **Key UI elements:** Centered auth card; logo/wordmark; email field; password field with show/hide toggle; "Remember me" checkbox; "Forgot password?" link; primary **Log in** button (full width); divider; SSO / Google buttons; link to Register.
- **Interactions:**
  - Inline validation on blur (email format, required fields); submit disabled until both fields are non-empty.
  - Invalid credentials show a non-blocking error banner above the form ("Email or password is incorrect").
  - Loading spinner replaces button label on submit; button is disabled during request.
  - Show/hide toggle reveals the password text.
- **Responsive behavior:** Card is max-width ≈420px, centered with generous margin on `lg`. On `md` it stays centered at ~90% width. On `sm` the card spans full width with 16px side padding, fields stack at 100% width, and the auth card has no elevation/shadow (edge-to-edge feel).

---

## 2. Register Page

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            StudyBuddy [logo]                               │
│        ┌────────────────────────────────────────────────────┐             │
│        │              Create your account                     │            │
│        │      Step ●──●──○   (1 of 3: Account)                │            │
│        │                                                      │            │
│        │   Full name                                          │            │
│        │   ┌────────────────────────────────────────────┐    │            │
│        │   │ Alex Carter                                │    │            │
│        │   └────────────────────────────────────────────┘    │            │
│        │   University email                                   │            │
│        │   ┌────────────────────────────────────────────┐    │            │
│        │   │ you@university.edu                          │    │            │
│        │   └────────────────────────────────────────────┘    │            │
│        │   Password                                           │            │
│        │   ┌────────────────────────────────────────────┐    │            │
│        │   │ ••••••••••                          [👁]    │    │            │
│        │   └────────────────────────────────────────────┘    │            │
│        │   Strength: ▓▓▓▓░░░  Good                            │            │
│        │   Confirm password                                   │            │
│        │   ┌────────────────────────────────────────────┐    │            │
│        │   │ ••••••••••                                  │    │            │
│        │   └────────────────────────────────────────────┘    │            │
│        │                                                      │            │
│        │   [ ] I agree to the Terms & Privacy Policy          │            │
│        │   ┌────────────────────────────────────────────┐    │            │
│        │   │            Continue  →                      │    │            │
│        │   └────────────────────────────────────────────┘    │            │
│        │   Already have an account?  Log in →                 │            │
│        └────────────────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────────────────────┘

  Step 2 (Profile): University ▼, Major/Course ▼, Year of study ▼, avatar upload.
  Step 3 (Subjects): multi-select chips of enrolled subjects + study-style tags
                      (e.g. [Morning] [Visual] [Group] [Quiet]).
```

- **Purpose:** Onboard new students and capture the minimum profile + subject data the matching engine needs.
- **Key UI elements:** Multi-step stepper (Account → Profile → Subjects); text inputs; password field with live **strength meter**; confirm-password field; terms checkbox; primary **Continue** button; link to Login. Steps 2–3 add selects (university, major, year), avatar uploader, and subject/study-style chip selectors.
- **Interactions:**
  - Real-time password strength + match validation; "Continue" disabled until current step is valid and terms accepted (final step).
  - Stepper allows going **back** without losing entered data (state preserved).
  - Email uniqueness checked on blur of step 1; chips toggle on tap in step 3.
- **Responsive behavior:** Same centered card pattern as Login. On `sm`, the horizontal stepper condenses to a "Step 1 of 3" text label with a slim progress bar; chip grids wrap to 2 columns then a single scrollable row.

---

## 3. Dashboard

```
┌──────────────┬───────────────────────────────────────────────────────────┐
│  SIDEBAR     │  Good morning, Alex 👋        Tue, 13 Jun · Week 6          │
│  (see shell) │                                                            │
│              │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  ▸ Dashboard │  │ Overall      │ │ Active       │ │ Study hours  │         │
│  ▸ Find Group│  │ progress     │ │ groups       │ │ this week    │         │
│  ▸ My Groups │  │   68%        │ │     3        │ │   12.5 h     │         │
│  ▸ Syllabus  │  │ ▓▓▓▓▓▓▓░░░   │ │  2 due soon  │ │  ▲ +2.1h     │         │
│  ▸ Progress  │  └──────────────┘ └──────────────┘ └──────────────┘         │
│  ▸ Planner   │                                                            │
│  ▸ Profile   │  ┌─────────────────────────────┐ ┌───────────────────────┐ │
│              │  │ Today's plan                │ │ Upcoming deadlines     │ │
│              │  │ ─────────────────────────── │ │ ────────────────────── │ │
│              │  │ ◷ 10:00 Calculus — Ch.4     │ │ • Algorithms quiz  2d  │ │
│              │  │ ◷ 14:00 Group: Algo Squad   │ │ • Essay draft      4d  │ │
│              │  │ ◷ 18:00 Revise: Graphs      │ │ • Lab report       6d  │ │
│              │  │ [ + Add task ]              │ │ [ View planner → ]     │ │
│              │  └─────────────────────────────┘ └───────────────────────┘ │
│              │                                                            │
│              │  ┌─────────────────────────────────────────────────────┐   │
│              │  │ Your study groups          [ Find new group → ]      │   │
│              │  │ ┌──────────┐ ┌──────────┐ ┌──────────┐               │   │
│              │  │ │Algo Squad│ │Calc Crew │ │OS Owls   │               │   │
│              │  │ │( A )(B)+2│ │( C )(D)+1│ │( E )+3   │               │   │
│              │  │ │next:Wed  │ │next:Thu  │ │next:Fri  │               │   │
│              │  │ │[ Open ]  │ │[ Open ]  │ │[ Open ]  │               │   │
│              │  │ └──────────┘ └──────────┘ └──────────┘               │   │
│              │  └─────────────────────────────────────────────────────┘   │
└──────────────┴───────────────────────────────────────────────────────────┘
```

- **Purpose:** Single-glance command center — surface progress, today's plan, deadlines, and the user's groups, with quick jumps into deeper pages.
- **Key UI elements:** Greeting + date/week banner; row of **3 stat cards** (overall progress with bar, active groups, study hours with delta); "Today's plan" timeline card with add-task; "Upcoming deadlines" list card; horizontally scrollable "Your study groups" card carousel with avatar stacks and CTAs.
- **Interactions:**
  - Stat cards are clickable → navigate to Progress / My Groups / Planner respectively.
  - "Add task" opens a quick-add modal; deadline items link to the relevant subject/group.
  - Group cards: "Open" → Study Group page; "Find new group" → matching page.
  - Real-time notification count in the top bar updates the bell badge.
- **Responsive behavior:** `lg` = 3-column stat row + 2-column content (plan / deadlines) + group carousel. `md` = stat cards wrap to 2-up (third drops to next line), content cards stack to a single column, sidebar becomes icon rail. `sm` = everything stacks to one column, stat cards become a horizontally swipeable row, group carousel scrolls horizontally with snap.

---

## 4. Study Group Page (detail: discussion board + progress)

```
┌──────────────┬───────────────────────────────────────────────────────────┐
│  SIDEBAR     │  ← Back   Algo Squad · Data Structures & Algorithms          │
│              │  ( A )( B )( C )( D )  +2 members   [ Invite ]  [ ⋯ ]        │
│              │  ┌─────────────────────────────────────────────────────┐   │
│              │  │ [ Discussion ] [ Shared progress ] [ Resources ] [ Members ]│ ← Tabs
│              │  └─────────────────────────────────────────────────────┘   │
│              │  ┌──────────────────────────────┐ ┌──────────────────────┐ │
│              │  │ DISCUSSION BOARD             │ │ GROUP PROGRESS         │ │
│              │  │ ──────────────────────────── │ │ ────────────────────── │ │
│              │  │ ( B ) Bilal · 2h             │ │ Week 6 topics          │ │
│              │  │  Can we cover graphs Wed?    │ │ ▓▓▓▓▓▓▓░░ 72%          │ │
│              │  │  ♥ 3   ↩ reply               │ │                        │ │
│              │  │ ──────────────────────────── │ │ [x] Big-O notation     │ │
│              │  │ ( C ) Chen · 5h              │ │ [x] Linked lists       │ │
│              │  │  Uploaded notes.pdf 📎       │ │ [ ] Trees & BST        │ │
│              │  │  ♥ 5   ↩ reply               │ │ [ ] Graph traversal    │ │
│              │  │ ──────────────────────────── │ │ [ ] Dijkstra           │ │
│              │  │  ┌─────────────────────────┐ │ │                        │ │
│              │  │  │ Write a message...      │ │ │ Next session:          │ │
│              │  │  └─────────────────────────┘ │ │ Wed 14:00 · Library    │ │
│              │  │  [📎] [😀]        [ Send ]    │ │ [ Mark attendance ]    │ │
│              │  └──────────────────────────────┘ └──────────────────────┘ │
└──────────────┴───────────────────────────────────────────────────────────┘
```

- **Purpose:** The collaboration hub for one group — real-time discussion, shared topic progress, resources, and member management.
- **Key UI elements:** Group header (name, subject, member avatar stack, Invite, overflow `⋯` menu); **tab bar** (Discussion / Shared progress / Resources / Members); discussion feed of message cards (avatar, name, timestamp, body, attachment, like, reply) with a sticky composer (text field, attach, emoji, Send); right-hand **Group progress** panel (weekly topic checklist, group progress bar, next-session card, attendance CTA).
- **Interactions:**
  - Tabs switch the main panel without navigation; Discussion is default.
  - Composer supports attachments and emoji; Send appends optimistically and broadcasts in real time.
  - Checking a topic updates the group progress bar and contributes to each member's tracker.
  - Like/reply are inline; `⋯` exposes mute, leave group, report.
- **Responsive behavior:** `lg` = two columns (discussion left ~2/3, progress right ~1/3). `md` = progress panel moves **above** the discussion as a collapsible summary; tabs remain. `sm` = single column; the right panel content is reachable via the "Shared progress" tab instead of a side column, and the composer docks to the bottom of the viewport.

---

## 5. Progress Tracker

```
┌──────────────┬───────────────────────────────────────────────────────────┐
│  SIDEBAR     │  Progress Tracker        Subject: [ All subjects ▼ ]        │
│              │                                                            │
│              │  ┌───────────────────────────────────────────────────┐    │
│              │  │ Overall completion                                 │    │
│              │  │  68%   ▓▓▓▓▓▓▓░░░░                                 │    │
│              │  │  34 of 50 topics done · 6-week streak 🔥           │    │
│              │  └───────────────────────────────────────────────────┘    │
│              │                                                            │
│              │  ┌──────────────────────┐  ┌───────────────────────────┐   │
│              │  │ Weekly activity       │  │ By subject                 │   │
│              │  │   ▁▃▅▂▇▆█  (bar chart) │  │ Calculus    ▓▓▓▓▓▓░ 80%    │   │
│              │  │   M T W T F S S       │  │ Algorithms  ▓▓▓▓░░░ 55%    │   │
│              │  │                       │  │ OS          ▓▓▓░░░░ 40%    │   │
│              │  │   12.5 h this week    │  │ Databases   ▓▓▓▓▓▓▓ 92%    │   │
│              │  └──────────────────────┘  └───────────────────────────┘   │
│              │                                                            │
│              │  ┌───────────────────────────────────────────────────┐    │
│              │  │ Algorithms — weekly topics                         │    │
│              │  │ ──────────────────────────────────────────────────│    │
│              │  │ Wk4  [x] Sorting          done · 100%              │    │
│              │  │ Wk5  [x] Hashing          done · 100%              │    │
│              │  │ Wk6  [~] Trees & graphs   in progress · 60% ▓▓▓░░  │    │
│              │  │ Wk7  [ ] Dynamic prog.    not started · 0%         │    │
│              │  │ Wk8  [ ] Greedy           not started · 0%         │    │
│              │  └───────────────────────────────────────────────────┘    │
└──────────────┴───────────────────────────────────────────────────────────┘
```

- **Purpose:** Quantify and visualize learning progress across subjects and weeks; reinforce momentum (streaks) and reveal gaps.
- **Key UI elements:** Subject filter dropdown; **overall completion** hero card (percentage, bar, topics done, streak); "Weekly activity" bar chart card with hours; "By subject" list of labeled progress bars; per-subject **weekly topics table** (week, status checkbox/state, topic, completion %, mini bar). Status uses three states: done `[x]`, in-progress `[~]`, not-started `[ ]` — encoded with **icon + text + bar**, never color alone (color-blind safe).
- **Interactions:**
  - Subject filter scopes every panel.
  - Toggling a topic's status updates overall %, the subject bar, and weekly chart live.
  - Charts have hover/focus tooltips with exact values; rows expand to show sub-topics.
- **Responsive behavior:** `lg` = hero full-width, then a 2-column row (activity chart / by-subject), then full-width topics table. `md` = the 2-column row stacks; table gains horizontal scroll. `sm` = all cards single column; the weekly topics "table" reflows into stacked rows (week + topic + status + bar per card), and the bar chart shrinks with fewer gridlines.

---

## 6. Planner

```
┌──────────────┬───────────────────────────────────────────────────────────┐
│  SIDEBAR     │  Planner    [ ‹ ]  Week of Jun 9–15  [ › ]   [Day][Week][▾]│
│              │                                          [ + New task ]     │
│              │  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐         │
│              │  │ Mon 9│Tue 10│Wed 11│Thu 12│Fri 13│Sat 14│Sun 15│         │
│              │  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤         │
│              │  │ 09:00│      │      │      │      │      │      │         │
│              │  │┌────┐│      │┌────┐│      │      │      │      │         │
│              │  ││Calc││      ││Algo││      │      │      │      │         │
│              │  ││Ch.4││      ││grp ││      │      │      │      │         │
│              │  │└────┘│      │└────┘│      │      │      │      │         │
│              │  │ 14:00│┌────┐│      │┌────┐│      │      │      │         │
│              │  │      ││ OS ││      ││Rev ││      │      │      │         │
│              │  │      ││read││      ││graph│     │      │      │         │
│              │  │      │└────┘│      │└────┘│      │      │      │         │
│              │  └──────┴──────┴──────┴──────┴──────┴──────┴──────┘         │
│              │  ┌─────────────────────────────────────────────────────┐   │
│              │  │ Unscheduled / backlog                                │   │
│              │  │ • Read DB ch.7   • Practice DP problems   • Essay outline│ │
│              │  └─────────────────────────────────────────────────────┘   │
└──────────────┴───────────────────────────────────────────────────────────┘

  New-task modal: Title, Subject ▼, Date, Start–End time, Link to group ▼,
                  Reminder ▼ (10m/1h/1d), [Cancel] [Save task]
```

- **Purpose:** Let students schedule study sessions and tasks, see their week at a glance, and link sessions to subjects/groups with reminders.
- **Key UI elements:** Toolbar (prev/next week, current range label, Day/Week/Month view switch, **New task** button); time-grid calendar with day columns and time rows; draggable task blocks (title + subject); a **backlog** strip of unscheduled tasks; new-task modal (title, subject, date, time range, group link, reminder).
- **Interactions:**
  - Drag tasks between slots/days to reschedule; drag from backlog onto the grid to schedule; resize a block to change duration.
  - Click a block to edit; click an empty slot to quick-create. Reminders feed the Notifications system.
  - View switch swaps grid density (Day = single wide column; Month = compact cells).
- **Responsive behavior:** `lg` = full 7-day week grid + backlog below. `md` = grid shows 3–4 days at a time with horizontal scroll, or defaults to Day view; backlog collapses to a toggle. `sm` = defaults to **Day view** (a single vertical agenda list of time-ordered blocks); week navigation via swipe; "New task" becomes a floating action button (FAB) bottom-right.

---

## 7. Profile (brief)

```
┌──────────────┬───────────────────────────────────────────────────────────┐
│  SIDEBAR     │  ┌─────────────────────────────────────────────────────┐   │
│              │  │   ( A large avatar )   Alex Carter        [ Edit ]    │   │
│              │  │                        CS · Year 2 · State University │   │
│              │  │   Bio: "Night owl, visual learner, loves graphs."     │   │
│              │  │   Study style: [Evening][Visual][Small group][Quiet]  │   │
│              │  └─────────────────────────────────────────────────────┘   │
│              │  ┌──────────────────────┐ ┌──────────────────────────────┐ │
│              │  │ Enrolled subjects     │ │ Stats                         │ │
│              │  │ • Calculus            │ │ Groups: 3   Streak: 6 wks     │ │
│              │  │ • Algorithms          │ │ Topics done: 34   Hrs: 120    │ │
│              │  │ • Operating Systems   │ │ Matches accepted: 8           │ │
│              │  │ • Databases           │ │                               │ │
│              │  └──────────────────────┘ └──────────────────────────────┘ │
└──────────────┴───────────────────────────────────────────────────────────┘
```

- **Purpose:** Show and edit the identity + preferences that drive matching, plus personal stats.
- **Key UI elements:** Profile header (avatar, name, course/year/university, bio, study-style tag chips, Edit); enrolled-subjects list card; stats card. Edit opens an inline/modal form mirroring Register steps 2–3.
- **Interactions:** Edit toggles editable fields; chips add/remove study-style and subject tags; avatar upload with crop.
- **Responsive behavior:** Header full-width; the two info cards sit side-by-side on `lg`/`md` and stack on `sm`. Tag chips wrap freely.

---

## 8. Notifications (brief)

```
┌──────────────┬───────────────────────────────────────────────────────────┐
│  SIDEBAR     │  Notifications      [ All ] [ Unread ]   [ Mark all read ]  │
│              │  ┌─────────────────────────────────────────────────────┐   │
│              │  │ ● 🤝 New match: Bilal wants to study Algorithms  · 5m │ │
│              │  │        [ Accept ]  [ Decline ]                        │   │
│              │  │ ● 💬 Chen posted in Algo Squad                  · 1h  │   │
│              │  │ ○ ⏰ Reminder: Calculus Ch.4 at 10:00           · 2h  │   │
│              │  │ ○ ✅ You completed "Hashing"                    · 1d  │   │
│              │  │ ○ 📅 Group session moved to Wed 14:00           · 2d  │   │
│              │  └─────────────────────────────────────────────────────┘   │
│              │              Toast (transient):                            │
│              │              ┌───────────────────────────────────┐         │
│              │              │ ✅ Task saved   [ Undo ]      [ × ]│         │
│              │              └───────────────────────────────────┘         │
└──────────────┴───────────────────────────────────────────────────────────┘
```

- **Purpose:** Centralize match invites, group activity, reminders, and progress events; allow quick action without leaving the page.
- **Key UI elements:** Filter tabs (All / Unread); "Mark all read"; notification rows (unread dot `●`, type icon, message, relative time, inline actions for actionable items); transient **toast** pattern (message, optional Undo, dismiss) used app-wide for confirmations.
- **Interactions:** Inline Accept/Decline on match invites; clicking a row deep-links to its source (group, planner, subject) and marks it read; toasts auto-dismiss (~5s) with Undo where reversible. The top-bar bell badge mirrors the unread count.
- **Responsive behavior:** Full-width list on all sizes; on `sm` inline action buttons stack below the message and the bell opens this as a full-screen sheet. Toasts anchor bottom-center on `sm`, bottom-right on `md`/`lg`.

---

## Cross-cutting responsive summary

| Region | lg (≥1024) | md (640–1024) | sm (<640) |
|---|---|---|---|
| Sidebar | Persistent labeled rail (~240px) | Icon-only rail (~72px) | Off-canvas drawer via ☰ |
| Top bar search | Inline field | Inline field | Collapses to 🔍 icon |
| Multi-column content | 2–3 columns | Stacks to 1–2 columns | Single column |
| Tables/grids | Full | Horizontal scroll | Reflow into stacked cards |
| Primary "create" action | Header button | Header button | Floating action button (FAB) |
| Modals | Centered dialog | Centered dialog | Full-screen sheet |

All interactive elements are keyboard-reachable with a visible focus ring, and status/state is always conveyed by **icon + text**, not color alone — see `08-ui-design.md` for the accessibility and visual specification.
