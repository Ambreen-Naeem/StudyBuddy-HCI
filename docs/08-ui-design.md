# StudyBuddy — UI Design System & Style Guide

> Document 08 · UI/UX Design Documentation
> Project: **StudyBuddy** — React + Tailwind CSS, fully responsive.
> This guide turns the low-fidelity wireframes in `07-wireframes.md` into a concrete, modern, accessible visual language: color, type, spacing, components, and high-fidelity mockup descriptions. It is the single source of truth for design tokens; the Tailwind config snippet at the end maps every token for implementation.

---

## 1. Design principles

1. **Calm & focused** — studying is the job; the UI stays quiet (lots of neutral surface, one confident accent) so content and progress are the heroes.
2. **Progress is visible** — bars, streaks, and stats are first-class, always paired with a number and a label.
3. **Accessible by default** — WCAG 2.1 **AA** minimum. Status is never color-only; focus is always visible; touch targets ≥ 44×44px.
4. **Consistent & token-driven** — every value below is a named token, so light/dark and theming stay coherent.

---

## 2. Color palette

The palette is built around an **indigo primary** with a **teal secondary** and an **amber accent**. These hues were chosen to be distinguishable under the common color-vision deficiencies (deuteranopia, protanopia, tritanopia): indigo↔teal↔amber keep their separation, and we **never rely on color alone** for state (always icon + text). Contrast ratios are stated against the surface they sit on.

### Brand & UI colors

| Token | Name | HEX | Usage | Contrast |
|---|---|---|---|---|
| `primary-600` | Indigo (primary) | `#4F46E5` | Primary buttons, active nav, links, key emphasis | 7.0:1 on white — AA/AAA text |
| `primary-700` | Indigo dark | `#4338CA` | Primary button hover/active | 8.6:1 on white |
| `primary-500` | Indigo mid | `#6366F1` | Focus ring, selected chips | 4.9:1 on white |
| `primary-50` | Indigo tint | `#EEF2FF` | Active nav background, badges | surface only |
| `secondary-600` | Teal (secondary) | `#0D9488` | Secondary actions, group accents, charts series B | 4.6:1 on white — AA |
| `secondary-50` | Teal tint | `#F0FDFA` | Secondary surfaces, info chips | surface only |
| `accent-500` | Amber (accent) | `#F59E0B` | Streaks, highlights, "upcoming" emphasis | 2.1:1 → **use on dark text/large only** |
| `accent-600` | Amber dark | `#D97706` | Amber text on white (small text) | 3.4:1 — large text/UI |

### Semantic (status) colors

| Token | Name | HEX | Usage | Contrast | Non-color cue |
|---|---|---|---|---|---|
| `success-600` | Green | `#15803D` | Completed topics, success toasts | 5.0:1 on white — AA | ✓ check icon + "Done" |
| `success-50` | Green tint | `#F0FDF4` | Success banner background | surface | — |
| `warning-600` | Amber-orange | `#B45309` | In-progress, due-soon, warnings | 4.7:1 on white — AA | ◐ half / ⏰ icon + "In progress" |
| `error-600` | Red | `#DC2626` | Errors, destructive actions, overdue | 4.5:1 on white — AA | ⚠ icon + message text |
| `error-50` | Red tint | `#FEF2F2` | Error banner background | surface | — |
| `info-600` | Blue | `#2563EB` | Informational notices | 4.6:1 on white — AA | ⓘ icon |

### Neutrals (slate ramp)

| Token | HEX | Usage |
|---|---|---|
| `neutral-0` | `#FFFFFF` | App/card surface (light) |
| `neutral-50` | `#F8FAFC` | App background (light) |
| `neutral-100` | `#F1F5F9` | Subtle fills, hover rows |
| `neutral-200` | `#E2E8F0` | Borders, dividers, track of progress bars |
| `neutral-300` | `#CBD5E1` | Disabled borders, input outlines |
| `neutral-400` | `#94A3B8` | Placeholder text, icons (muted) |
| `neutral-500` | `#64748B` | Secondary text (≈4.6:1 on white) |
| `neutral-700` | `#334155` | Body text (≈10:1 on white) |
| `neutral-900` | `#0F172A` | Headings, primary text |

**Dark mode** (brief): surfaces shift to `neutral-900 #0F172A` (bg) / `#1E293B` (card); body text `#E2E8F0`; primary lightens to `#818CF8` to retain contrast on dark.

**Contrast policy:** body text ≥ 4.5:1, large text (≥18.66px bold / 24px) and UI components ≥ 3:1. Amber is reserved for surfaces/large UI, never small body text on white (use `accent-600`/`warning-600` for amber text needs).

---

## 3. Typography

**Primary typeface:** **Inter** (variable) — highly legible at UI sizes, tabular figures for stats.
**Fallback stack:** `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
**Monospace** (code/IDs): `ui-monospace, "JetBrains Mono", SFMono-Regular, Menlo, monospace`.

### Type scale (1.250 major-third-ish, tuned for UI)

| Token | Element | Size (px / rem) | Weight | Line-height | Use |
|---|---|---|---|---|---|
| `display` | Hero number (e.g. "68%") | 48 / 3rem | 700 | 1.1 | Big progress stat |
| `h1` | Page title | 30 / 1.875rem | 700 | 1.2 | "Progress Tracker" |
| `h2` | Section title | 24 / 1.5rem | 600 | 1.25 | Card group headings |
| `h3` | Card title | 20 / 1.25rem | 600 | 1.3 | "Today's plan" |
| `h4` | Sub-heading | 18 / 1.125rem | 600 | 1.35 | List group labels |
| `body-lg` | Lead body | 16 / 1rem | 400 | 1.6 | Default paragraph |
| `body` | Body | 14 / 0.875rem | 400 | 1.55 | Dense UI text, table cells |
| `caption` | Caption/meta | 12 / 0.75rem | 500 | 1.4 | Timestamps, helper text |
| `overline` | Labels | 11 / 0.6875rem | 600 (uppercase, +0.06em) | 1.3 | Eyebrow labels, badges |

Weights used: 400 (regular), 500 (medium), 600 (semibold), 700 (bold). Numbers in stats use **tabular-nums** for alignment. Max paragraph measure ≈ 70ch.

---

## 4. Spacing, layout & breakpoints

### Spacing scale (4px base, 8px rhythm)

`0, 1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px, 8=32px, 10=40px, 12=48px, 16=64px`.
Component internal padding defaults: inputs/buttons `12px 16px`; cards `24px`; page gutters `24px` (`16px` on mobile). Vertical rhythm between sections: `24–32px`.

### Radii & elevation

- **Radius:** `sm 6px` (inputs, chips), `md 10px` (buttons, cards), `lg 16px` (modals, hero cards), `full` (avatars, pills).
- **Shadow:** `sm 0 1px 2px rgba(15,23,42,.06)` (cards at rest); `md 0 4px 12px rgba(15,23,42,.10)` (raised/hover); `lg 0 12px 32px rgba(15,23,42,.16)` (modals/popovers). Light mode favors soft shadows; dark mode favors borders over shadows.

### Grid & breakpoints

12-column fluid grid, 24px gutters, max content width **1280px**, centered.

| Token | Min width | Target | Sidebar | Columns |
|---|---|---|---|---|
| `sm` | 0–639px | Mobile | Drawer | 1 |
| `md` | 640–1023px | Tablet | Icon rail | 1–2 |
| `lg` | 1024–1279px | Laptop | Labeled rail | 2–3 |
| `xl` | ≥1280px | Desktop | Labeled rail | 3 |

Touch targets ≥ 44×44px; minimum text size 12px; line length capped for readability.

---

## 5. Component library

Every component lists **appearance**, **states**, and **accessibility**. States follow the order: default → hover → focus → active → disabled (+ loading/error where relevant).

### 5.1 Buttons

- **Variants:** `primary` (solid indigo `primary-600`, white text), `secondary` (solid teal `secondary-600`), `outline` (1px `neutral-300` border, `neutral-900` text, transparent fill), `ghost` (no border, text-only, hover fill `neutral-100`), `danger` (solid `error-600`).
- **Sizes:** `sm` 32px h / 12px text, `md` 40px h / 14px text (default), `lg` 48px h / 16px text. Radius `md`. Icon-left optional; full-width variant for forms.
- **States:** hover → darken one step (e.g. `primary-700`); focus → 2px focus ring `primary-500` with 2px offset; active → slight scale 0.98 + darker; disabled → `neutral-200` bg, `neutral-400` text, no pointer; loading → spinner replaces label, button width preserved, `aria-busy="true"`.
- **Accessibility:** real `<button>`; label is descriptive (not "click here"); icon-only buttons require `aria-label`; never convey state by color alone (disabled also loses elevation).

### 5.2 Inputs & form fields

- **Appearance:** 40px height, `neutral-300` 1px border, radius `sm`, white fill, `neutral-900` text, `neutral-400` placeholder. Label above in `body`/medium; helper/caption below.
- **States:** focus → border `primary-500` + 2px ring; error → border `error-600`, helper text `error-600` with ⚠ icon and `aria-invalid`; disabled → `neutral-100` fill, `neutral-400` text; success → optional `success-600` border + ✓.
- **Variants:** text, password (with show/hide eye toggle), textarea (composer), select/dropdown (`▼`, listbox semantics), checkbox & radio (44px hit area, custom check uses icon not color alone), chips/tags (selectable pills with `aria-pressed`), search field (leading 🔍).
- **Accessibility:** every field has a programmatic `<label for>`; errors linked via `aria-describedby`; password strength meter has text label ("Good") not just bar.

### 5.3 Cards

- **Appearance:** white surface, radius `md`/`lg`, padding 24px, `shadow-sm`, optional 1px `neutral-200` border. Header (title `h3` + optional action link/menu), body, optional footer.
- **States:** static by default; **interactive cards** (group cards, stat cards) get hover `shadow-md` + 1px translate-up, and a focus ring when keyboard-focused (they are `<a>`/`<button>`). 
- **Accessibility:** clickable cards expose a single focusable element with an accessible name; decorative icons are `aria-hidden`.

### 5.4 Modals / dialogs

- **Appearance:** centered, max-width 480px (forms) / 640px (content), radius `lg`, `shadow-lg`, 24px padding, scrim `rgba(15,23,42,.5)`. Header (title + ✕ close), body, footer actions right-aligned ([Cancel] ghost, [Save] primary).
- **States:** enter/exit fade+scale (150ms); on `sm` becomes a full-screen sheet sliding from bottom.
- **Accessibility:** `role="dialog"` `aria-modal="true"`, focus trapped inside, focus returns to trigger on close, `Esc` closes, scrim click closes (non-destructive only), labelled by the title id.

### 5.5 Navbar (top bar)

- **Appearance:** 64px tall, white, bottom border `neutral-200`, sticky. Left: hamburger (mobile) + logo/wordmark. Center/left: global search. Right: notifications bell (with count badge), avatar menu.
- **States:** search focus ring; bell badge is a `error-600`/`primary-600` pill with count; avatar menu opens a popover (Profile, Settings, Log out).
- **Accessibility:** `role="banner"`; search is a labeled form; bell has `aria-label="Notifications, 3 unread"`; menu is a proper popover with arrow-key navigation.

### 5.6 Sidebar (primary nav)

- **Appearance:** vertical list of nav items (icon + label), 240px on `lg`. Active item: `primary-50` background, `primary-700` text/icon, 3px left indicator bar. Section divider above Settings/Log out.
- **States:** hover `neutral-100`; active as above; collapsed (icon-only) on `md` shows tooltips on hover/focus.
- **Accessibility:** `<nav aria-label="Primary">`, active item `aria-current="page"`; drawer on mobile traps focus and is dismissible; icons paired with text labels (or tooltip + `aria-label` when collapsed).

### 5.7 Badges & chips

- **Badges:** small pills (overline type) for counts/status — e.g. "2 due soon" (`warning`), "Done" (`success`), "New" (`primary`). Always **icon or text**, color is reinforcement only.
- **Chips:** study-style/subject tags; selectable variant toggles `primary-50` fill + `primary-600` text + check icon when active (`aria-pressed`), removable variant has an `×` with `aria-label="Remove {tag}"`.

### 5.8 Progress bars

- **Appearance:** 8px track `neutral-200`, radius full; fill `primary-600` (or subject color). Always accompanied by a numeric % label and, where relevant, "X of Y" text. Circular variant for the dashboard overall stat.
- **States:** indeterminate variant animates a sliding segment for loading.
- **Accessibility:** `role="progressbar"` with `aria-valuenow/min/max` and an accessible label; the percentage text is the non-color cue.

### 5.9 Toasts / notifications

- **Toast:** transient, bottom-center (mobile) / bottom-right (desktop), `shadow-lg`, leading status icon, message, optional [Undo], dismiss ✕. Auto-dismiss ~5s (pauses on hover/focus). Variants: success/info/warning/error map to semantic colors **plus** their icon.
- **Notification rows:** unread = filled dot `●` + slightly stronger weight; type icon (🤝 match, 💬 message, ⏰ reminder, ✅ progress, 📅 schedule); relative timestamp; inline actions where actionable.
- **Accessibility:** toasts in an `aria-live="polite"` region (errors `assertive`); not the only delivery channel for critical info; actions are real buttons.

### 5.10 Tabs

- **Appearance:** underline-style tab bar (Discussion / Shared progress / Resources / Members). Active tab: `primary-700` text + 2px `primary-600` underline; inactive `neutral-500`.
- **States:** hover `neutral-700`; focus ring on the tab; active underline animates.
- **Accessibility:** `role="tablist"`/`tab`/`tabpanel`, arrow-key navigation, `aria-selected`, panels associated via `aria-controls`.

### 5.11 Avatars

- **Appearance:** circular, sizes 24/32/40/64px; image or initials on a `primary-100`-style tinted fill; **avatar stacks** overlap at −8px with a "+N" counter pill for overflow.
- **States:** optional online dot (`success-600`) with a ring; group avatars show role badge if owner.
- **Accessibility:** `alt` with the person's name; "+2" counter has `aria-label="2 more members"`; presence dot paired with text in tooltips (not color only).

---

## 6. Iconography & imagery

- **Icon set:** a single consistent line set — **Lucide** (or Heroicons outline) — 1.5–2px stroke, 20px/24px grid, rounded joins to match the friendly tone. Filled variants only for active/selected states.
- **Usage:** icons reinforce labels, they don't replace them in primary nav or status. Decorative icons are `aria-hidden="true"`; meaningful standalone icons get `aria-label`. Keep one visual weight per context.
- **Emoji:** used sparingly for warmth in greetings/notifications (👋 🔥 🤝) — never as the sole carrier of meaning.
- **Imagery / illustration:** light, friendly spot illustrations for empty states ("No groups yet — find your first study partner") and onboarding; flat style, palette-aligned (indigo/teal/amber), generous whitespace. Avatars accept user photos with a circular crop. Avoid heavy photography in dense data views.
- **Empty / loading / error states:** every list has an illustrated empty state with a CTA; loading uses skeleton shimmers (neutral-100/200) not spinners for content; errors use a calm message + retry.

---

## 7. High-fidelity mockup descriptions

### 7.1 Dashboard (hi-fi)

Background `neutral-50`; persistent 240px sidebar in white with the **Dashboard** item highlighted (`primary-50` fill, indigo left bar). Top bar white with a soft bottom border. The greeting "Good morning, Alex 👋" is `h1` in `neutral-900`; the week meta in `neutral-500` caption to its right.

Three **stat cards** sit in a row on white surfaces with `shadow-sm` and 24px padding. The first card leads with a 48px `display` indigo number "68%" above a circular progress ring (indigo fill on `neutral-200` track) — the visual anchor of the page. The second uses teal accents for "Active groups"; the third uses amber (`accent`) for the study-hours delta "▲ +2.1h", paired with the word "this week" so the trend isn't color-only. Hover lifts each card with `shadow-md`.

Below, a two-column band: **Today's plan** (left, wider) is a timeline of pill-shaped session rows with small subject color dots and times in `neutral-500`; a ghost "+ Add task" button sits at the bottom. **Upcoming deadlines** (right) is a tight list, each item with a `warning`/`error` countdown badge ("2d") — red only when overdue, always with the day count as text. The **Your study groups** card spans full width with horizontally snapping group cards: each shows an overlapping avatar stack, "next: Wed" meta, and an outline "Open" button. Visual hierarchy: big progress number → stat row → plan/deadlines → groups. Generous 24–32px gaps keep it calm.

### 7.2 Study Group page (hi-fi)

A group header pins the identity: group name in `h1`, subject in `neutral-500`, an overlapping avatar stack with a "+2" pill, a teal **Invite** secondary button, and an overflow `⋯` ghost menu. Teal is the group context accent throughout (selected tab underline stays indigo for consistency).

An underline **tab bar** sits below (Discussion active, indigo underline). The body is two columns on desktop: the **discussion board** (≈2/3) is a scrollable feed of message cards — circular avatar, name in `neutral-900` semibold, timestamp in caption, body in `body-lg`, attachments as bordered file chips, and subtle ♥/↩ actions. A **sticky composer** docks at the bottom of the column: rounded `neutral-300` input, 📎/😀 ghost icon buttons, and a solid indigo **Send**. The **group progress** panel (≈1/3) is a card with a labeled progress bar ("72%"), a weekly-topic checklist using ✓/◐/▢ icons + text (color-blind safe), and a highlighted "Next session" sub-card with a teal **Mark attendance** button. Real-time updates animate new messages in with a gentle fade. On mobile the progress panel is reached via the "Shared progress" tab and the composer fixes to the viewport bottom.

### 7.3 Progress Tracker (hi-fi)

The hero is a full-width card: a 48px indigo "68%" `display` number beside a wide progress bar, with "34 of 50 topics done · 6-week streak 🔥" beneath — the streak chip uses amber `accent` with the flame icon. Below, a two-column row: a **Weekly activity** bar chart (indigo bars on a faint `neutral-200` baseline, day labels in caption, "12.5 h this week" summary) and a **By subject** list where each subject has its own bar — Calculus indigo, Algorithms teal, OS amber, Databases green — but every bar is labeled with its name and exact %, so the chart reads without relying on hue.

The full-width **weekly topics table** uses zebra rows (`neutral-50` alternating), a week column, and a status cell that combines a colored icon with text: green ✓ "done", amber ◐ "in progress" (+ a mini inline bar at 60%), and a neutral ▢ "not started" — three encodings (icon, text, position) guarantee accessibility. Hovering a chart bar reveals a `shadow-lg` tooltip with the precise value. The overall feel is data-dense but airy, with the single indigo accent keeping focus on completion.

---

## 8. Tailwind config snippet (token mapping)

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',   // tablet
      lg: '1024px',  // laptop
      xl: '1280px',  // desktop
    },
    extend: {
      colors: {
        primary: {
          50:  '#EEF2FF',
          500: '#6366F1',
          600: '#4F46E5', // primary
          700: '#4338CA',
        },
        secondary: {
          50:  '#F0FDFA',
          600: '#0D9488', // teal
        },
        accent: {
          500: '#F59E0B', // amber (surfaces/large UI only)
          600: '#D97706',
        },
        success: { 50: '#F0FDF4', 600: '#15803D' },
        warning: { 50: '#FFFBEB', 600: '#B45309' },
        error:   { 50: '#FEF2F2', 600: '#DC2626' },
        info:    { 600: '#2563EB' },
        neutral: {
          0:   '#FFFFFF',
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          700: '#334155',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system',
               'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // [size, { lineHeight, fontWeight }]
        caption:   ['0.75rem',  { lineHeight: '1.4' }],   // 12
        body:      ['0.875rem', { lineHeight: '1.55' }],  // 14
        'body-lg': ['1rem',     { lineHeight: '1.6' }],   // 16
        h4:        ['1.125rem', { lineHeight: '1.35', fontWeight: '600' }], // 18
        h3:        ['1.25rem',  { lineHeight: '1.3',  fontWeight: '600' }], // 20
        h2:        ['1.5rem',   { lineHeight: '1.25', fontWeight: '600' }], // 24
        h1:        ['1.875rem', { lineHeight: '1.2',  fontWeight: '700' }], // 30
        display:   ['3rem',     { lineHeight: '1.1',  fontWeight: '700' }], // 48
      },
      spacing: { // 4px base; defaults already match, explicit for clarity
        1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px',
        6: '24px', 8: '32px', 10: '40px', 12: '48px', 16: '64px',
      },
      borderRadius: { sm: '6px', md: '10px', lg: '16px', full: '9999px' },
      boxShadow: {
        sm: '0 1px 2px rgba(15,23,42,.06)',
        md: '0 4px 12px rgba(15,23,42,.10)',
        lg: '0 12px 32px rgba(15,23,42,.16)',
      },
      maxWidth: { content: '1280px' },
      ringColor: { DEFAULT: '#6366F1' }, // focus ring = primary-500
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
```

### Implementation notes

- Set `:focus-visible { outline: 2px solid theme(colors.primary.500); outline-offset: 2px }` (or Tailwind `focus-visible:ring-2 ring-primary-500 ring-offset-2`) on all interactive elements — never remove focus styles.
- Use `tabular-nums` (`font-variant-numeric`) on all stat/percentage numbers.
- Pair every status color with an icon and text label (`success ✓`, `warning ◐/⏰`, `error ⚠`) so the UI passes color-blind review.
- Respect `prefers-reduced-motion`: disable card-lift/scale transitions and toast slides.

---

*This style guide and `07-wireframes.md` together constitute the StudyBuddy UI/UX specification: wireframes define structure, this document defines the visual and interaction system, and the Tailwind tokens make both directly implementable in the React codebase.*
