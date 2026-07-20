# StudyBuddy — HCI Principles & Usability Design Document

**Document ID:** 09-hci-principles
**Project:** StudyBuddy — Collaborative Study-Group Matching & Planning Platform
**Stack:** React + Tailwind CSS (frontend) · Flask REST API (backend) · SQLite (database)
**Audience:** HCI course evaluators, design reviewers, frontend engineers
**Status:** Canonical reference for all interaction-design decisions

---

## 0. Introduction & How to Read This Document

This is the central Human-Computer Interaction (HCI) reference for **StudyBuddy**. Every interaction, screen, and component in the product is designed against a small set of well-established usability frameworks so that design decisions are *principled* rather than arbitrary.

This document covers four bodies of theory and shows, for each principle:

1. **(a) What it means** — the canonical definition.
2. **(b) Concrete StudyBuddy implementation** — the actual screen, component, or behavior that realizes it.
3. **(c) Example UI behavior** — a walk-through of what the user sees and feels.

The four frameworks are:

| § | Framework | Items |
|---|-----------|-------|
| 1 | Nielsen's 10 Usability Heuristics | 10 |
| 2 | Shneiderman's 8 Golden Rules | 8 |
| 3 | Accessibility Principles (WCAG-aligned) | 6 areas |
| 4 | UX Design Principles | 6 |

A final **traceability table** (§5) maps every principle to the screen/component where it lives and the testing method used to verify it.

### 0.1 Reference Map of StudyBuddy Screens & Components

So that the implementation notes below stay concrete, here is the canonical inventory referenced throughout:

**Primary screens**
- **Auth screens** — Login, Sign-up, Forgot-password
- **Dashboard** — landing hub: greeting, today's tasks, active groups, streak widget, progress summary, recent notifications
- **Profile / Account** — name, avatar, subjects, semester, skill level, weekly schedule, password & account settings
- **Group Matching** — match wizard + ranked list of suggested study groups/partners
- **Study Group page** — tabbed: Discussion Board, Progress Tracker, Members, Admin Controls
- **Syllabus Breakdown** — course → weekly topics, editable checklist
- **Progress Tracking** — percentages, progress bars, weekly targets, study-streak counter
- **Study Planner** — task list, deadlines, weekly view, monthly calendar, reminders
- **Notifications Center** — chronological feed + unread badge

**Shared components (design system)**
- `Button` (primary / secondary / destructive / ghost), `IconButton`
- `Toast` (success / info / warning / error) — transient, top-right
- `Modal` and `ConfirmDialog` — focus-trapped overlays
- `ProgressBar` and `RadialProgress`
- `Badge` / `Chip` (subject tags, skill level, status)
- `Input`, `Select`, `DatePicker`, `Checkbox`, `Toggle` with inline validation
- `Tabs`, `Breadcrumbs`, `Sidebar`, `TopBar`
- `Skeleton` loaders, `Spinner`, `EmptyState`
- `Tooltip`, `Avatar`, `Card`, `Banner`

---

# 1. Nielsen's 10 Usability Heuristics

Jakob Nielsen's heuristics are the most widely used yardstick for interface quality. Each is treated below as a design requirement that StudyBuddy must satisfy.

---

## 1.1 Visibility of System Status

**(a) What it means.** The system should always keep users informed about what is going on, through appropriate, timely feedback. Users should never have to guess whether an action succeeded, is in progress, or failed.

**(b) StudyBuddy implementation.**
- **Loading states everywhere.** Any view backed by a Flask API call (Dashboard cards, Group Matching results, Discussion Board) renders `Skeleton` loaders while `fetch` is pending, then swaps to content. Buttons that trigger a request (e.g., "Join Group", "Save Profile") enter a disabled `isLoading` state with an inline `Spinner` and label change ("Saving…").
- **Toasts confirm outcomes.** Successful writes raise a green success `Toast` ("Task added to your planner"); failures raise an error `Toast`.
- **Streak & progress are live.** The Progress Tracking screen's `ProgressBar` and study-streak counter update immediately after a task is checked off, so the user *sees* the percentage move.
- **Notifications badge.** The `TopBar` bell shows an unread count badge that decrements as items are read.
- **Optimistic UI with reconciliation.** Checking a syllabus topic flips the checkbox instantly; if the backend rejects it, the checkbox reverts and a warning `Toast` appears.

**(c) Example.** On the Planner, the user clicks **Add Task**. The button text becomes "Saving…" with a spinner; ~400 ms later the modal closes, the task animates into the weekly view, and a toast reads "Task added — due Friday." The user is never left wondering whether the click registered.

---

## 1.2 Match Between System and the Real World

**(a) What it means.** Speak the users' language with familiar words, phrases, and concepts; follow real-world conventions; present information in a natural and logical order.

**(b) StudyBuddy implementation.**
- **Student vocabulary, not engineering jargon.** The UI says "Study group", "Semester", "Syllabus", "Weekly target", "Deadline", "Study streak" — never "record", "entity", or "tuple".
- **Calendar metaphor.** The Planner's monthly view is a real grid calendar (Sun–Sat columns), matching the wall-calendar mental model; weekly view mirrors a paper planner.
- **Real-world progress metaphors.** Completion uses **percentages and progress bars** (a fuel-gauge metaphor) and a **streak** counter (borrowed from familiar habit apps) — concepts students already understand.
- **Logical ordering.** Syllabus Breakdown lists topics in week order (Week 1 → Week 12), matching how courses are actually taught.

**(c) Example.** When matching, the wizard asks "Which subjects are you studying this semester?" and "When are you usually free?" — phrased as a peer would ask, then shows results as cards reading "Calculus II · Intermediate · 3 open spots", not a raw data dump.

---

## 1.3 User Control and Freedom

**(a) What it means.** Users often choose functions by mistake and need a clearly marked "emergency exit." Support undo and redo; let users back out without an extended dialogue.

**(b) StudyBuddy implementation.**
- **Cancel on every modal.** Every `Modal`/`ConfirmDialog` has an explicit **Cancel** button, a close (×) affordance, and dismisses on `Esc`.
- **Undo via toast.** Destructive-but-reversible actions (deleting a task, removing a syllabus topic, leaving a group) show a toast with an **Undo** action for ~6 seconds before the backend commit is finalized.
- **Non-destructive navigation.** Breadcrumbs and a persistent sidebar let users leave any deep screen (e.g., a Group's Admin Controls) without losing their place; the multi-step Match wizard has a **Back** button on every step.
- **Draft safety.** Composing a discussion post and navigating away triggers an "Leave without posting?" confirm.

**(c) Example.** A user deletes a planner task. It vanishes, but a toast appears: "Task deleted · **Undo**." Clicking Undo restores it exactly; ignoring it lets the deletion stand. No data is lost to a misclick.

---

## 1.4 Consistency and Standards

**(a) What it means.** Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions (Jakob's Law).

**(b) StudyBuddy implementation.**
- **Single design system.** All buttons, inputs, cards, and tabs come from shared React components themed by Tailwind tokens, so a primary button looks and behaves identically on the Profile, Planner, and Group pages.
- **Consistent action placement.** Primary action is always bottom-right of a modal; destructive actions are always red; Cancel is always to the left of Confirm.
- **Standard conventions.** The bell = notifications, a gear = settings, a trash icon = delete, a pencil = edit — matching universal web conventions. Links are styled consistently; the logo always returns to Dashboard.
- **Consistent terminology.** "Group" never becomes "team" or "room" elsewhere; "Deadline" is never relabeled "due date" in one screen and "deadline" in another.

**(c) Example.** A student who learned to edit their profile by clicking the pencil icon will, on the Study Group page, instinctively recognize the same pencil icon to edit the group description — the interaction transfers with zero relearning.

---

## 1.5 Error Prevention

**(a) What it means.** Even better than good error messages is a careful design that prevents problems from occurring in the first place. Eliminate error-prone conditions or check for them and confirm before committing.

**(b) StudyBuddy implementation.**
- **Constrained inputs.** Deadlines use a `DatePicker` (no free-text date typos); skill level and semester are `Select` dropdowns; schedule is chosen from preset time blocks — illegal values can't be entered.
- **Inline validation before submit.** The Sign-up and Profile forms validate email format and password strength on blur, disabling the submit button until the form is valid, preventing failed round-trips.
- **Confirmation for the irreversible.** Deleting a group, removing a member, or deleting an account triggers a `ConfirmDialog` that restates the consequence ("This permanently deletes the group and its discussion board").
- **Smart defaults.** New tasks default to "today" and the current week; new groups default to the creator's current semester — reducing the chance of wrong entries.
- **Guarded admin actions.** Admin-only controls are hidden (not just disabled) for non-admins, so members can't even attempt an unauthorized action.

**(c) Example.** A user typing a new password sees a live strength meter and the rule "min 8 characters." The **Create account** button stays greyed out until the rule is met, so the server never has to reject the form.

---

## 1.6 Recognition Rather Than Recall

**(a) What it means.** Minimize memory load by making objects, actions, and options visible. Users should not have to remember information from one part of the interface to another.

**(b) StudyBuddy implementation.**
- **Dashboard surfaces everything.** Instead of remembering deadlines, active groups, or progress, the user sees today's tasks, group cards, the streak, and a progress summary on one screen.
- **Selected context is shown, not memorized.** The Match wizard displays previously chosen subjects/schedule as removable `Chips` so users recognize their selections instead of recalling them.
- **Autocomplete & suggestions.** Subject fields autocomplete from a course catalog; the planner suggests recent task names.
- **Visible status badges.** Group cards show "Admin", "3 open spots", and unread-post counts so the user recognizes state at a glance.
- **Breadcrumbs** show the current location path rather than expecting the user to remember how they got there.

**(c) Example.** Returning to the Match screen after a day, the user immediately sees their prior filters rendered as chips ("Calculus II", "Evenings", "Intermediate") and the ranked results — no need to remember or re-enter anything.

---

## 1.7 Flexibility and Efficiency of Use

**(a) What it means.** Accelerators — unseen by the novice — may speed up interaction for the expert, so the system can cater to both. Allow users to tailor frequent actions.

**(b) StudyBuddy implementation.**
- **Keyboard shortcuts.** Global shortcuts for power users: `N` = new task, `G` then `P` = go to Planner, `G` then `D` = Dashboard, `/` = focus search, `Esc` = close modal. A "?" overlay lists them.
- **Quick-add.** A persistent "+ Add task" affordance lets experienced users add a planner item from anywhere without navigating to the Planner first.
- **Saved match filters.** Frequent matchers can save a filter set and re-run it in one click.
- **Multiple views.** Planner offers weekly *and* monthly views; the user picks the density that suits them. Progress can be viewed per-subject or aggregated.
- **Bulk actions.** Admins can multi-select members for batch operations.

**(c) Example.** A novice clicks Dashboard → Planner → Add Task → fills the modal. A power user presses `N` anywhere, types the task and a date, hits `Enter` — same result in two seconds. Both paths are first-class.

---

## 1.8 Aesthetic and Minimalist Design

**(a) What it means.** Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information competes with the relevant units and diminishes their visibility.

**(b) StudyBuddy implementation.**
- **One primary action per screen.** Each screen has a single, visually dominant call-to-action; secondary actions are de-emphasized (`ghost`/`secondary` styles).
- **Progressive disclosure** (see §4.6): advanced group settings live behind an "Advanced" expander; the discussion thread shows replies collapsed until expanded.
- **Generous whitespace & restrained palette.** Tailwind spacing tokens and a limited brand palette keep screens calm; cards group related info so the eye isn't overloaded.
- **Empty states instead of clutter.** A group with no posts shows a friendly `EmptyState` ("No discussions yet — start one!") rather than empty scaffolding.

**(c) Example.** The Dashboard shows four clean cards (Today, Groups, Progress, Notifications) rather than every datapoint the app holds. Detailed breakdowns are one click away, keeping the landing view scannable in under five seconds.

---

## 1.9 Help Users Recognize, Diagnose, and Recover from Errors

**(a) What it means.** Error messages should be expressed in plain language (no codes), precisely indicate the problem, and constructively suggest a solution.

**(b) StudyBuddy implementation.**
- **Plain-language messages.** A failed login reads "We couldn't find an account with that email and password" — not "401 Unauthorized."
- **Field-level diagnosis.** Form errors render *next to the offending field* in red with an icon and text ("Password must be at least 8 characters"), and the field gets an error ring + `aria-describedby`.
- **Recovery actions.** Network failures show a `Banner` with a **Retry** button; a failed save keeps the user's entered data intact so they can fix and resubmit.
- **404 / empty routes** render a friendly screen with a "Back to Dashboard" button.

**(c) Example.** Submitting the profile form with an invalid email scrolls to and highlights the email field, shows "Enter a valid email address (e.g., name@school.edu)", and focuses it — the user knows exactly what's wrong and how to fix it.

---

## 1.10 Help and Documentation

**(a) What it means.** Even though it's better if the system can be used without documentation, it may be necessary to provide help. It should be easy to search, focused on the user's task, and concrete.

**(b) StudyBuddy implementation.**
- **Contextual tooltips.** `Tooltip`s explain non-obvious controls (the streak icon, "weekly target", admin toggles) on hover/focus.
- **Inline empty-state guidance.** First-time screens double as documentation: the empty Planner explains how to add a task; the empty Groups list explains how matching works with a **Find a group** button.
- **First-run onboarding.** A short, dismissible coachmark tour highlights Dashboard → Matching → Planner on first login.
- **Help center.** A "?" menu in the `TopBar` links to a searchable FAQ/Help page ("How does matching work?", "How are streaks calculated?") and a contact link.

**(c) Example.** Hovering the streak flame shows a tooltip: "You've studied 5 days in a row. Complete one task today to keep your streak." Documentation arrives exactly where and when the question forms.

---

# 2. Shneiderman's 8 Golden Rules of Interface Design

Shneiderman's rules overlap with Nielsen's but emphasize interaction *flow* and user agency. Here is how StudyBuddy applies each.

## 2.1 Strive for Consistency
Same as §1.4: a single Tailwind/React design system enforces identical components, terminology, icon meanings, and action placement across Dashboard, Planner, Profile, and Group pages. Consistent layouts (sidebar + top bar on every authenticated screen) mean the navigation model never changes.

## 2.2 Enable Frequent Users to Use Shortcuts
Same accelerators as §1.7: keyboard shortcuts (`N`, `G P`, `/`, `Esc`), global quick-add, saved match filters, and bulk admin actions let frequent users bypass full navigation. A discoverable "?" shortcut sheet teaches them.

## 2.3 Offer Informative Feedback
Every action yields feedback proportionate to its weight: hover/focus states for minor actions; `Toast` confirmations for saves; `ProgressBar`/streak animation for progress; `Skeleton`/`Spinner` for in-flight requests; the notifications badge for background events. Nothing happens silently. (Cross-refs §1.1.)

## 2.4 Design Dialogs to Yield Closure
Multi-step flows have a clear beginning, middle, and end. The Match wizard shows a stepper (Step 1 of 3 → 2 → 3) and ends on a "Here are your matches" results screen. Adding a task ends with the task visibly landing in the planner + a confirming toast. Account sign-up ends on a welcoming Dashboard. Each sequence gives the satisfying sense of "done."

## 2.5 Offer Simple Error Handling
Errors are prevented where possible (constrained inputs, validation, smart defaults — §1.5) and, when they occur, handled gently: field-level messages, preserved form data, and one-click **Retry**. The user is never dropped into a dead end or asked to decode an error code. (Cross-refs §1.9.)

## 2.6 Permit Easy Reversal of Actions
Undo-via-toast for deletions, **Cancel**/`Esc` on every modal, **Back** in every wizard step, and "Leave without saving?" guards make almost every action reversible. This encourages exploration because mistakes are cheap. (Cross-refs §1.3.)

## 2.7 Support Internal Locus of Control
Users are the initiators, not the system. StudyBuddy avoids surprise actions: it never auto-joins a group, never auto-deletes, and never moves the user without their click. Matching *suggests* but the user chooses to join. Notifications inform but don't hijack focus. Settings (theme, reminder timing, notification preferences) let users bend the system to their will.

## 2.8 Reduce Short-Term Memory Load
The Dashboard and visible chips/badges/breadcrumbs mean users recognize rather than recall (§1.6). Context carries forward automatically (chosen subjects persist as chips; the planner remembers your week). Wizards never ask users to remember a value from a previous step — prior selections stay on screen.

---

# 3. Accessibility Principles (WCAG 2.1 AA Aligned)

Accessibility is a first-class requirement, targeting **WCAG 2.1 Level AA**. Implementation is rooted in semantic HTML first, ARIA second.

## 3.1 High Contrast
- **Implementation.** Text/background pairs in the Tailwind theme are chosen to meet **WCAG AA contrast ratios** — at least **4.5:1** for normal text and **3:1** for large text and meaningful UI/graphical elements (buttons, progress bars, icons). The primary brand color used for buttons passes 4.5:1 against white text.
- **Verification.** Contrast checked with automated tooling (axe / Lighthouse) and a manual contrast-checker against the design tokens.
- **Example.** Error text is a dark red (not a pale pink) on a light background so it remains legible for low-vision users and in bright environments.

## 3.2 Keyboard Navigation (Tab Order, Focus Management, Skip Links)
- **Logical tab order.** DOM order follows visual order; no positive `tabindex` hacks. Every interactive element (links, buttons, inputs, tabs, toggles) is reachable and operable by keyboard.
- **Focus management.** Opening a `Modal`/`ConfirmDialog` moves focus into the dialog and **traps** it; closing returns focus to the triggering element. Newly revealed content (e.g., wizard next step) receives focus.
- **Visible focus rings.** A clear `focus-visible` outline (Tailwind `ring`) is never removed — every focusable element shows where focus is.
- **Skip link.** A "Skip to main content" link is the first tabbable element, letting keyboard users bypass the sidebar/top bar.
- **Example.** A keyboard-only user tabs to the bell, presses `Enter`, the Notifications panel opens with focus on its first item, and `Esc` closes it and returns focus to the bell.

## 3.3 ARIA Labels and Roles
- **Implementation.** Icon-only buttons carry `aria-label` ("Notifications", "Edit profile"). `Tabs` use `role="tablist"`/`tab`/`tabpanel` with `aria-selected`. Toasts use `role="status"`/`aria-live="polite"`; critical errors use `aria-live="assertive"`. The unread badge exposes `aria-label="3 unread notifications"`. `ProgressBar` uses `role="progressbar"` with `aria-valuenow/min/max`. Modals use `role="dialog"` + `aria-modal="true"` + `aria-labelledby`.
- **Principle.** ARIA only supplements semantic HTML; native `<button>`, `<nav>`, `<main>`, `<form>`, `<label>` are used first.
- **Example.** A screen reader announces the matching progress bar as "Profile completeness, 80 percent" because of its `role` and `aria-valuenow`.

## 3.4 Responsive Design
- **Implementation.** Tailwind responsive breakpoints (`sm`/`md`/`lg`/`xl`) drive a mobile-first layout. The sidebar collapses to a hamburger drawer on small screens; the Planner monthly grid becomes a scrollable agenda list; cards stack to a single column. Touch targets are at least ~44×44 px.
- **Example.** On a phone, the Dashboard's four cards stack vertically and the calendar switches to a list of upcoming items, remaining fully usable without horizontal scrolling.

## 3.5 Color-Blind Friendly UI (Never Rely on Color Alone)
- **Implementation.** Status is always encoded redundantly — color **plus** an icon and/or text label. A completed task = green **+ check icon + "Done"**; an overdue task = red **+ warning icon + "Overdue"**. Progress bars include a numeric percentage label, not just fill color. Toast types include a leading icon (✓, !, ✕) so meaning survives in grayscale.
- **Example.** A user with deuteranopia distinguishes "Overdue" from "Done" tasks by the warning triangle and the word "Overdue," not by red-vs-green alone.

## 3.6 Screen Reader Compatibility
- **Implementation.** Landmark regions (`<header>`, `<nav>`, `<main>`, `<footer>`), one `<h1>` per screen with logical heading hierarchy, all form fields associated with `<label>` (or `aria-labelledby`), and `alt` text on meaningful images/avatars (decorative images get `alt=""`). Live regions announce async updates (new notification, save success). Route changes update the document title and move focus to the new view's heading.
- **Verification.** Manually tested with NVDA (Windows) and VoiceOver, plus automated axe checks.
- **Example.** After adding a task, the `aria-live` region announces "Task added, due Friday," so a non-sighted user gets the same confirmation a sighted user gets from the toast.

**Design-system mapping.** All of the above are baked into shared components, so accessibility is inherited by default: any screen using `<Button>`, `<Modal>`, `<Tabs>`, `<ProgressBar>`, or `<Input>` is automatically focus-managed, labeled, and contrast-compliant — engineers cannot accidentally ship an inaccessible button.

---

# 4. UX Design Principles

## 4.1 User-Centered Design
- **What it means.** Design around real user goals, contexts, and tasks — validated with users — rather than around the data model.
- **StudyBuddy.** The whole IA is organized around a student's actual jobs-to-be-done: *find people to study with* (Matching), *plan my work* (Planner), *track my progress* (Progress/Streak), *collaborate* (Group/Discussion). Personas (e.g., "overwhelmed first-year", "organized senior") and task flows drove the navigation. Onboarding collects subjects/schedule/skill level precisely because those are what students care to be matched on.
- **Shows up as.** A Dashboard that answers "what should I do today and who am I doing it with?" the moment a student logs in.

## 4.2 Simple Navigation
- **What it means.** Users should always know where they are, where they can go, and how to get back — with shallow, predictable structure.
- **StudyBuddy.** A persistent left `Sidebar` (Dashboard, Matching, Groups, Planner, Progress, Profile) + `TopBar` (search, notifications, account) on every authenticated screen. `Breadcrumbs` inside deep areas (Group → Admin Controls). The logo always returns to Dashboard. Navigation depth is kept to ~2 levels.
- **Shows up as.** From anywhere, the user reaches any major area in one click and always sees the active item highlighted in the sidebar.

## 4.3 Clear Feedback
- **What it means.** Every user action produces an immediate, understandable response.
- **StudyBuddy.** Toasts, progress animations, button loading states, inline validation, and the notifications badge (consolidated from §1.1 and §2.3). State changes are visible and immediate.
- **Shows up as.** Checking off a syllabus topic instantly advances the progress bar and may bump the streak — the cause-and-effect is unmistakable.

## 4.4 Minimal Cognitive Load
- **What it means.** Reduce the mental effort needed to understand and use the interface.
- **StudyBuddy.** Recognition over recall (Dashboard, chips, breadcrumbs), constrained inputs (dropdowns, date pickers), smart defaults, chunking related fields into cards, and progressive disclosure of advanced options. Numbers are pre-digested (a single "68% complete" rather than raw counts the user must compute).
- **Shows up as.** Creating a group is a short form with sensible defaults already filled in, so the user makes a few choices rather than many.

## 4.5 Visual Hierarchy
- **What it means.** Layout, size, weight, color, and spacing guide the eye to what matters most, in priority order.
- **StudyBuddy.** One dominant primary `Button` per screen; larger/bolder section headings; the streak and today's tasks given prominent placement on the Dashboard; secondary actions rendered as `ghost`/`secondary`; muted colors for metadata. Tailwind's type scale and spacing tokens enforce consistent hierarchy.
- **Shows up as.** On a Group page, the **Join** (or primary admin) action is the most visually salient element; settings and metadata recede.

## 4.6 Progressive Disclosure
- **What it means.** Show only what's needed now; reveal advanced or secondary detail on demand to avoid overwhelming users.
- **StudyBuddy.** Group creation shows essentials first with an **"Advanced settings"** expander (visibility, join rules); discussion replies are collapsed under "View 4 replies"; the Match wizard reveals one step at a time; syllabus weeks expand to show topics only when opened; the Profile "Account & security" section is a separate collapsible panel.
- **Shows up as.** A first-time user creating a group sees just name + subject + semester; the power user clicks "Advanced" to fine-tune — neither is overwhelmed nor limited.

---

# 5. Traceability Matrix — Principle → Implementation → Verification

| # | Principle | Where Implemented (Screen / Component) | How Verified (Testing Method) |
|---|-----------|----------------------------------------|-------------------------------|
| **Nielsen 1** | Visibility of system status | Skeleton/Spinner loaders, button loading states, Toast, ProgressBar, notifications badge (Dashboard, Planner, Matching) | Usability test (observe wait moments); manual check that every async action shows feedback |
| **Nielsen 2** | Match real world | Student vocabulary, calendar metaphor (Planner monthly view), week-ordered Syllabus, % + streak | Content review; comprehension test with student participants |
| **Nielsen 3** | User control & freedom | Cancel/×/Esc on Modal, Undo-toast on delete, wizard Back, breadcrumbs | Task-based usability test (force a mistake, observe recovery); keyboard test |
| **Nielsen 4** | Consistency & standards | Shared design system, fixed action placement, standard icons | Heuristic evaluation; component-library audit / visual regression |
| **Nielsen 5** | Error prevention | DatePicker, Selects, inline validation, ConfirmDialog, smart defaults, hidden admin actions | Form testing with invalid input; confirm dialogs verified for all destructive actions |
| **Nielsen 6** | Recognition over recall | Dashboard cards, filter chips, autocomplete, status badges, breadcrumbs | Cognitive walkthrough; first-time-user test |
| **Nielsen 7** | Flexibility & efficiency | Keyboard shortcuts, quick-add, saved filters, weekly/monthly views, bulk actions | Expert vs. novice path timing; shortcut sheet review |
| **Nielsen 8** | Aesthetic & minimalist | One primary CTA/screen, whitespace, EmptyStates, progressive disclosure | Heuristic evaluation; 5-second test for scannability |
| **Nielsen 9** | Recognize/recover errors | Plain-language messages, field-level errors, Retry banner, preserved form data, 404 screen | Error-path testing; screen-reader announcement check |
| **Nielsen 10** | Help & documentation | Tooltips, onboarding coachmarks, EmptyState guidance, searchable Help/FAQ | Walkthrough of first-run; FAQ findability test |
| **Shneiderman 1** | Consistency | Design system across all screens | Component audit; heuristic evaluation |
| **Shneiderman 2** | Shortcuts | Keyboard shortcuts, quick-add, saved filters | Expert-path timing test |
| **Shneiderman 3** | Informative feedback | Toasts, progress animation, loading states, badge | Manual feedback-coverage audit |
| **Shneiderman 4** | Dialogs yield closure | Match wizard stepper + results, sign-up → Dashboard, add-task confirmation | Flow walkthrough; completion-rate metric |
| **Shneiderman 5** | Simple error handling | Validation + Retry + preserved data | Error-injection testing |
| **Shneiderman 6** | Easy reversal | Undo-toast, Cancel/Esc, wizard Back, unsaved-changes guard | Mistake-recovery usability test |
| **Shneiderman 7** | Internal locus of control | No auto-join/auto-delete; user-initiated actions; preference settings | Behavioral review; expectation-violation check |
| **Shneiderman 8** | Reduce memory load | Dashboard, persistent chips/badges, carried-forward context | Cognitive walkthrough |
| **A11y 1** | High contrast | Tailwind theme tokens (AA 4.5:1 / 3:1) | axe / Lighthouse + manual contrast checker |
| **A11y 2** | Keyboard navigation | Tab order, focus trap in Modal, focus-visible rings, skip link | Keyboard-only walkthrough |
| **A11y 3** | ARIA labels/roles | aria-label on icon buttons, tablist/dialog/progressbar roles, aria-live toasts | axe automated scan; manual ARIA review |
| **A11y 4** | Responsive design | Tailwind breakpoints, collapsible sidebar, stacking cards, 44px targets | Device/emulator testing across breakpoints |
| **A11y 5** | Color-blind friendly | Status = color + icon + label; numeric % on bars | Grayscale review; color-blind simulator |
| **A11y 6** | Screen reader compat | Landmarks, heading order, labeled fields, alt text, live regions, focus-on-route-change | NVDA + VoiceOver testing; axe scan |
| **UX 1** | User-centered design | IA around student jobs-to-be-done; persona-driven onboarding | User research; task success rate |
| **UX 2** | Simple navigation | Sidebar + TopBar + breadcrumbs, shallow depth | Findability / tree test |
| **UX 3** | Clear feedback | Toasts, progress animation, loading/validation states | Feedback-coverage audit |
| **UX 4** | Minimal cognitive load | Constrained inputs, defaults, chunked cards, pre-digested numbers | Cognitive walkthrough; NASA-TLX style rating |
| **UX 5** | Visual hierarchy | One dominant CTA, type scale, prominent streak/today | 5-second test; preference test |
| **UX 6** | Progressive disclosure | Advanced expanders, collapsed replies, stepwise wizard, expandable syllabus weeks | First-run vs. expert walkthrough |

---

## 6. Summary

StudyBuddy's interface is engineered, not decorated. Every screen and component traces back to an explicit HCI principle: Nielsen's heuristics govern moment-to-moment usability, Shneiderman's rules shape interaction flow and user agency, WCAG-aligned accessibility ensures the product is usable by everyone via keyboard and screen reader, and the UX principles keep the whole experience centered on the student. Because these principles are implemented inside a shared React + Tailwind design system, good interaction behavior is *inherited by default* across the Dashboard, Matching, Groups, Syllabus, Progress, Planner, and Notifications — and the traceability matrix in §5 makes each commitment auditable and testable.
