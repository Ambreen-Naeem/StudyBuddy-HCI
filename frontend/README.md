# StudyBuddy — Frontend

A **React + Vite + Tailwind CSS** frontend for **StudyBuddy**, a university HCI
project. StudyBuddy helps students find study groups, lay out their syllabus into
a weekly plan, track topic progress, and plan tasks and deadlines.

It talks to a **Flask REST API** expected at `http://localhost:5000/api`.

---

## Tech stack

- **React 18** + **Vite** (fast dev server, instant HMR)
- **React Router v6** (routing + protected routes)
- **Tailwind CSS** (design tokens in `tailwind.config.js`)
- **axios** (HTTP client with a JWT Bearer interceptor)
- State via **React Context** (`AuthContext`, `ToastContext`) + hooks
- **JWT** stored in `localStorage`, sent as `Authorization: Bearer <token>`

## Accessibility / HCI focus

- Semantic HTML, ARIA roles/labels, `aria-current` on the active nav item
- Visible keyboard **focus rings** (`:focus-visible`) and a **skip link**
- **Color-blind friendly**: status is shown with **icon + text**, never color alone
- Toasts announced via an `aria-live` region; destructive actions use a **confirm dialog**
- Modals use `role="dialog"`, `aria-modal`, and a **focus trap** with focus restore
- Consistent **loading / empty / error** states on every data-driven page
- Fully **responsive** (mobile drawer sidebar → fixed desktop sidebar)
- Honors `prefers-reduced-motion`

---

## Prerequisites

- **Node.js 18+** and npm
- The StudyBuddy **Flask backend** running on **port 5000**

---

## Setup & run (Windows PowerShell)

```powershell
# 1. From the repo root, enter the frontend folder
cd "E:\HCI project\frontend"

# 2. Install dependencies
npm install

# 3. (Optional) configure the API base URL
Copy-Item .env.example .env   # then edit .env if needed

# 4. Start the dev server (http://localhost:5173)
npm run dev
```

> The Vite dev server proxies any request to `/api` → `http://localhost:5000`,
> so make sure the Flask backend is running on port **5000**. If the backend is
> unreachable, pages degrade gracefully (loading / empty / error states).

### Other scripts

```powershell
npm run build     # production build into ./dist
npm run preview   # preview the production build locally
```

---

## Configuration

| Variable             | Default | Description                                              |
| -------------------- | ------- | -------------------------------------------------------- |
| `VITE_API_BASE_URL`  | `/api`  | API base URL. Use a full URL for a deployed backend.     |

The API base URL and JWT interceptor live in `src/api/client.js`.

---

## Pages & routes

| Route                 | Page              | Description                                                        |
| --------------------- | ----------------- | ----------------------------------------------------------------- |
| `/login`              | Login             | Sign in, stores JWT                                               |
| `/register`           | Register          | Create an account (client-side validation)                       |
| `/`                   | Dashboard         | Subjects, topics done/remaining, streak, upcoming tasks, groups  |
| `/profile`            | Profile           | View/edit name, university, semester, skill level, bio           |
| `/find-groups`        | FindGroups        | Match by subject/semester/skill level; join (send request)       |
| `/groups`             | GroupList         | Your groups; create a new group                                  |
| `/groups/:groupId`    | GroupDetail       | Members, discussion board, group progress, admin controls        |
| `/subjects`           | Subjects          | List/add subjects                                                |
| `/subjects/:subjectId`| SyllabusDetail    | Enter topics → auto weekly breakdown (Week 1 / Topic A, …)        |
| `/progress`           | ProgressTracker   | Progress bars, weekly targets, mark topics complete              |
| `/planner`            | Planner           | Tasks + deadlines, weekly / monthly toggle                       |
| `/notifications`      | Notifications     | List + mark-as-read (single / all)                              |
| `*`                   | NotFound          | 404 fallback                                                     |

All routes except `/login` and `/register` are wrapped in `ProtectedRoute` and
share the app shell (`Layout` → `Navbar` + `Sidebar`).

---

## Expected backend endpoints

The frontend assumes these REST endpoints under the API base URL:

| Method | Endpoint                                         | Used by            |
| ------ | ------------------------------------------------ | ------------------ |
| POST   | `/auth/login`                                    | Login              |
| POST   | `/auth/register`                                 | Register           |
| GET    | `/auth/me`                                        | Session bootstrap  |
| GET    | `/dashboard`                                      | Dashboard          |
| PUT    | `/profile`                                        | Profile            |
| GET    | `/groups`                                         | GroupList          |
| POST   | `/groups`                                         | Create group       |
| GET    | `/groups/match`                                   | FindGroups         |
| POST   | `/groups/:id/join`                                | Join request       |
| GET    | `/groups/:id`                                     | GroupDetail        |
| DELETE | `/groups/:id`                                     | Delete group       |
| POST   | `/groups/:id/posts`                               | Discussion post    |
| POST   | `/groups/:id/posts/:postId/replies`               | Reply              |
| DELETE | `/groups/:id/members/:memberId`                   | Remove member      |
| POST   | `/groups/:id/requests/:requestId`                 | Accept/reject join |
| GET    | `/subjects`, `/subjects/:id`                      | Subjects/Syllabus  |
| POST   | `/subjects`, `/subjects/:id/topics`               | Add subject/topics |
| GET    | `/progress`                                       | ProgressTracker    |
| PATCH  | `/topics/:id`                                     | Mark topic done    |
| GET/POST/PATCH/DELETE | `/tasks`, `/tasks/:id`              | Planner            |
| GET/PATCH | `/notifications`, `/notifications/:id`         | Notifications      |
| POST   | `/notifications/read-all`                         | Mark all read      |

Response shapes are handled defensively (e.g. accepting either a bare array or a
wrapped `{ items }` object) so minor backend differences won't break the UI.

---

## Project structure

```
frontend/
├─ index.html
├─ vite.config.js          # React plugin + /api proxy
├─ tailwind.config.js      # design tokens (colors, fonts, radius, shadows)
├─ postcss.config.js
├─ src/
│  ├─ main.jsx             # providers + mount
│  ├─ App.jsx              # routes (public + protected)
│  ├─ index.css            # Tailwind + base/focus styles
│  ├─ api/client.js        # axios instance + JWT interceptor
│  ├─ context/AuthContext.jsx
│  ├─ hooks/useFetch.js
│  ├─ components/          # Button, Input, Card, Modal, Badge, ProgressBar,
│  │                       # Spinner, EmptyState, ConfirmDialog, Navbar,
│  │                       # Sidebar, Layout, ProtectedRoute, NotificationBell,
│  │                       # Toast/ToastContext
│  └─ pages/               # Login, Register, Dashboard, Profile, FindGroups,
│                          # GroupList, GroupDetail, Subjects, SyllabusDetail,
│                          # ProgressTracker, Planner, Notifications, NotFound
```
