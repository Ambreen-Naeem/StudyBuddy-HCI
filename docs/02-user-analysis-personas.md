# StudyBuddy — User Analysis & Personas

**Document:** 02 — User Analysis & Personas
**Project:** StudyBuddy — Find Study Partners, Build Better Study Habits
**Course:** Human-Computer Interaction (HCI)
**Date:** 13 June 2026

---

## 1. User Analysis Methodology

Understanding *who* will use StudyBuddy — and *why*, *when*, and *under what pressures* — is the foundation of every design decision that follows. This document presents the user analysis carried out for StudyBuddy, the user segments identified, a set of detailed personas, empathy-map highlights, a user-needs matrix, and key user scenarios.

The analysis followed a standard human-centred design approach:

1. **Define the user space.** We began with the known primary audience (university students) and identified the meaningful ways students differ — by year of study, academic confidence, time pressure, and study style.

2. **Gather insight.** We drew on informal interviews with students, observation of how students currently coordinate study (group chats, shared notes, ad-hoc meetups), and review of common pain points reported in academic-support literature.

3. **Segment the audience.** Raw insights were grouped into sub-segments that share goals and behaviours, ensuring the design serves the full spread of the audience rather than only the "average" student.

4. **Synthesise personas.** Recurring patterns were distilled into representative personas — fictional but evidence-grounded characters that keep the team focused on real human goals and frustrations rather than abstract requirements.

5. **Map empathy and needs.** For each persona we captured what they say, think, do, and feel, then translated those into a consolidated needs matrix linking each need to a StudyBuddy feature.

6. **Validate through scenarios.** Finally, we wrote concrete usage scenarios that walk each persona through StudyBuddy, confirming that the feature set genuinely resolves their pain points.

The personas and scenarios below are the working reference the team uses to prioritise features, resolve design trade-offs, and evaluate usability.

---

## 2. Primary User Group: University Students

StudyBuddy's single primary user group is **university students** who want to study more effectively, with the right people, on a clear plan. Within this group, four sub-segments capture the most important variation in needs and behaviour.

### 2.1 Sub-Segments

| Sub-segment | Defining characteristics | Core need from StudyBuddy |
|-------------|--------------------------|---------------------------|
| **Organised high-achievers** | Self-disciplined, goal-driven, already plan their study; want efficiency and quality partners. | Better tools to track progress and find serious, well-matched peers. |
| **Struggling / first-year students** | New to university, overwhelmed, unsure how to structure study or find help. | Structure, encouragement, visible progress, and approachable groups. |
| **Working / part-time students** | Juggle jobs or family with study; severely time-constrained; availability is the bottleneck. | Schedule-aware matching, planning, and reminders that respect limited time. |
| **Social / collaborative learners** | Learn best with others; motivated by accountability and discussion. | Easy group discovery, active discussion boards, and shared accountability. |

These sub-segments are not rigid; a single real student may shift between them across a semester. The personas in Section 3 each anchor one dominant sub-segment while remaining realistically multi-dimensional.

---

## 3. Personas

The following three detailed personas represent the most important and most distinct users of StudyBuddy.

---

### 3.1 Persona 1 — Aisha Khan, the Organised High-Achiever

> **Photo placeholder:** *A confident final-year student in a tidy library study booth, colour-coded planner open beside a laptop, sticky notes neatly arranged.*

| Attribute | Detail |
|-----------|--------|
| **Name** | Aisha Khan |
| **Age** | 22 |
| **University / Year** | Final-year (Year 3), BSc Computer Science |
| **Sub-segment** | Organised high-achiever |
| **Tech comfort** | Very high — early adopter, uses multiple productivity apps daily. |

**Bio.** Aisha is a top-performing final-year Computer Science student aiming for a first-class degree and a competitive graduate role. She already plans her weeks meticulously across a calendar, a to-do app, and a spreadsheet — but the tools don't talk to each other, and none of them help her find study partners who match her pace. She values efficiency and dislikes wasted time in poorly-organised groups.

**Goals.**
- Maintain a clear, visible overview of progress across all her subjects.
- Find serious, well-matched study partners at a similar skill level.
- Hit weekly targets and protect an unbroken study streak.
- Spend less time switching between disconnected planning tools.

**Frustrations / Pain points.**
- Existing tools are fragmented; she re-enters the same information in several places.
- Group chats are noisy and full of people not actually committed to studying.
- No tool shows her, at a glance, how far through each subject she really is.
- Mismatched partners slow her down rather than help.

**Study habits.** Studies in disciplined 90-minute blocks, plans the week every Sunday, prefers a small number of high-quality study partners over large groups, tracks everything quantitatively.

**Representative quote.**
> *"I don't need motivation — I need everything in one place and people who are as serious as I am."*

**How StudyBuddy helps.** The **dashboard** unifies her tasks, progress stats, and study hours in one view, eliminating tool-switching. **Smart matching** by skill level and schedule connects her with equally committed peers. **Progress tracking** with percentages, weekly targets, and a **study streak** gives her the at-a-glance quantitative view she craves, while the **study planner** keeps her weekly Sunday planning ritual inside a single app.

---

### 3.2 Persona 2 — Daniel Owusu, the Struggling First-Year

> **Photo placeholder:** *A first-year student looking slightly overwhelmed at a cluttered desk in a dorm room, an intimidatingly long syllabus PDF open on screen.*

| Attribute | Detail |
|-----------|--------|
| **Name** | Daniel Owusu |
| **Age** | 19 |
| **University / Year** | First-year (Year 1), BA Economics |
| **Sub-segment** | Struggling / first-year student |
| **Tech comfort** | Moderate — comfortable with social apps, less so with productivity/planning tools. |

**Bio.** Daniel has just started university and is finding the jump from school overwhelming. Lectures move faster than he expected, the syllabi look enormous, and he doesn't yet know anyone well enough to ask for help. He often doesn't know *what* he should be studying this week, falls behind without realising, and feels anxious as exams approach. He wants to do well but lacks structure and confidence.

**Goals.**
- Understand what to study each week and stay on pace.
- Find approachable peers and groups without the awkwardness of asking strangers.
- Build steady study habits and regain a sense of control.
- See evidence that he is making progress, to stay motivated.

**Frustrations / Pain points.**
- The syllabus is a flat, intimidating wall of text with no obvious starting point.
- He feels isolated and unsure how to find or join a study group.
- He falls behind silently because nothing shows him he's drifting.
- Productivity tools feel complicated and built for people who are already organised.

**Study habits.** Inconsistent — studies in bursts before deadlines, easily distracted, learns better with others but rarely has the chance, responds well to encouragement and visible small wins.

**Representative quote.**
> *"Honestly, I don't even know where to start — I just need someone to show me the path and tell me I'm on it."*

**How StudyBuddy helps.** The **syllabus breakdown** turns the intimidating syllabus into clear Week 1 / Topic A, Week 2 / Topic B steps, so Daniel always knows the next thing to study. **Smart matching** and easy **join requests** lower the social barrier to finding a welcoming group, while the per-group **discussion board** lets him ask questions without face-to-face pressure. **Progress bars**, **weekly targets**, and **progress reminders** give him visible small wins and an early warning when he's drifting, rebuilding his confidence.

---

### 3.3 Persona 3 — Maria Santos, the Working Part-Time Student

> **Photo placeholder:** *A student in a cafe on a short break, phone propped up checking a study plan, work apron still on, bag half-packed.*

| Attribute | Detail |
|-----------|--------|
| **Name** | Maria Santos |
| **Age** | 26 |
| **University / Year** | Second-year (Year 2), BSc Nursing (part-time) |
| **Sub-segment** | Working / part-time student |
| **Tech comfort** | Moderate-to-high — efficient on mobile, values tools that save time. |

**Bio.** Maria studies Nursing part-time while working shifts to support herself. Her availability is fragmented and unpredictable — early mornings before a shift, a free evening here and there. She is motivated and capable but chronically short on time, and most study groups meet at times she simply cannot make. She needs a system that respects her constraints and helps her use small windows of time well.

**Goals.**
- Find study partners and groups whose schedules actually overlap with hers.
- Plan study around irregular work shifts without constant manual juggling.
- Never miss a deadline despite a packed, shifting calendar.
- Make the most of short, scattered study windows.

**Frustrations / Pain points.**
- Most groups assume full-time, daytime availability she doesn't have.
- Coordinating schedules manually is exhausting and error-prone.
- Deadlines sneak up because her week is so fragmented.
- Generic planners ignore the reality of shift work.

**Study habits.** Studies in short, focused windows around shifts; relies heavily on reminders; prefers asynchronous collaboration (discussion boards) over fixed meeting times; plans by deadline rather than by routine.

**Representative quote.**
> *"I can study — I just need the app to fit around my shifts instead of pretending I'm free all day."*

**How StudyBuddy helps.** **Schedule-aware smart matching** uses her **availability schedule** to surface only partners and groups whose times genuinely overlap with hers. The **study planner** with **deadlines**, **weekly/monthly views**, and **reminders** lets her plan around shifts and ensures no deadline is missed. Asynchronous **discussion boards** let her contribute when she has a moment rather than at a fixed meeting time, and **deadline notifications** act as a safety net across her fragmented week.

---

## 4. Empathy-Map Highlights

The empathy map captures what each persona **says, thinks, does, and feels** — the qualitative texture behind their needs.

| Persona | Says | Thinks | Does | Feels |
|---------|------|--------|------|-------|
| **Aisha** (high-achiever) | "Just give me everything in one place." | "Is this partner serious enough to be worth my time?" | Plans weekly, tracks metrics, studies in disciplined blocks. | Confident, but frustrated by fragmented tools and noise. |
| **Daniel** (first-year) | "I don't know where to start." | "Am I already behind? Is it normal to feel this lost?" | Studies in last-minute bursts, hesitates to ask for help. | Overwhelmed, anxious, but hopeful with encouragement. |
| **Maria** (working) | "It has to fit around my shifts." | "Will this group ever meet when I'm actually free?" | Studies in short windows, leans on reminders, works asynchronously. | Determined but time-pressured and stretched thin. |

**Cross-cutting insights.**
- All three want **less friction** — fewer tools, clearer next steps, less manual coordination.
- All three are motivated by **visible progress and accountability**, though they need it delivered differently (metrics for Aisha, encouragement for Daniel, safety-net reminders for Maria).
- **Schedule and compatibility** matter to every persona; matching that ignores availability fails all of them.

---

## 5. User Needs Matrix

The matrix below links each prioritised user need to the StudyBuddy feature that satisfies it and the personas it most serves.

| # | User Need | StudyBuddy Feature | Primary Personas |
|---|-----------|--------------------|-----------------|
| 1 | "Help me find people who match my subject, level, and schedule." | Smart study-group matching | Aisha, Daniel, Maria |
| 2 | "Show me what to study and in what order." | Syllabus breakdown into weekly topics | Daniel |
| 3 | "Let me see how far I've come and stay motivated." | Progress tracking (%, bars, targets, streak) | Aisha, Daniel |
| 4 | "Help me plan around a busy, shifting schedule." | Study planner (tasks, deadlines, weekly/monthly views) | Maria, Aisha |
| 5 | "Make sure I never miss a deadline or reminder." | Reminders & notifications | Maria, Daniel |
| 6 | "Give me an approachable way to ask for and offer help." | Study groups + discussion board | Daniel, Maria |
| 7 | "Put everything important in one glance." | Unified dashboard | Aisha, Maria, Daniel |
| 8 | "Let me run a group fairly and keep it on track." | Group admin controls, join requests, shared progress tracker | Aisha |
| 9 | "Keep my profile and preferences accurate so matches are good." | Accounts & profile (subjects, availability, learning style) | All |

Every prioritised need maps to at least one feature, and every feature serves at least one prioritised need — confirming feature/need alignment.

---

## 6. Key User Scenarios

The following scenarios narrate how each persona uses StudyBuddy in a realistic situation, validating the feature set end-to-end.

### Scenario A — Aisha unifies her workflow and finds a serious partner
It's Sunday evening. Aisha logs into StudyBuddy and lands on her **dashboard**, where she sees this week's upcoming tasks, her current study streak, and progress stats across all three of her subjects. She notices her Algorithms progress has slipped below her weekly target. From the **recommended groups** panel, she spots a small group matched on her skill level and schedule, requests to join, and is accepted by the admin. She adds three focused study tasks for the week in the **planner**, each tied to a subject and deadline, then closes the app — all her planning done in one place in under ten minutes.

### Scenario B — Daniel breaks down an intimidating syllabus and joins a welcoming group
Two weeks into term, Daniel feels lost in his Economics module. He opens StudyBuddy, adds the subject, and uses the **syllabus breakdown** to split it into Week 1 / Topic A, Week 2 / Topic B, and so on. For the first time he can see exactly what he should be studying *this* week. He marks the first topic complete and watches the **progress bar** move — a small but real win. Nervous about reaching out, he uses **smart matching** to find a beginner-friendly group and sends a **join request**. Once accepted, he posts his first question on the group's **discussion board** without the anxiety of asking face-to-face. A **progress reminder** later that week nudges him before he drifts behind.

### Scenario C — Maria plans study around her shifts and never misses a deadline
Maria finishes a hospital shift and has 40 minutes before the next. She opens StudyBuddy on her phone, where **schedule-aware matching** has surfaced a study group whose evening availability overlaps with her own free slots. She joins and catches up on the **discussion board** asynchronously, contributing a note while she has the time. In the **planner**, she checks the **weekly view**, sees an assignment due in three days, and a **deadline notification** confirms she's on track. Because the app fits around her shifts rather than assuming she's free all day, Maria stays on top of her course despite a demanding schedule.

### Scenario D — A group admin manages membership and tracks shared progress
Aisha, now admin of her Algorithms group, receives a **notification** about a new **join request**. She reviews the requester's profile (subject, semester, skill level) and approves them, using **admin controls** to keep the group well-matched. Over the following weeks she watches the group's **shared progress tracker** to ensure everyone is keeping pace, and posts a study-plan summary to the **discussion board** so the group stays aligned ahead of an exam.

---

*End of Document 02 — User Analysis & Personas.*
