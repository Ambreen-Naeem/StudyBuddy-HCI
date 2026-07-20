# StudyBuddy — Presentation (VBA generator)

`StudyBuddy_Deck.bas` is a **PowerPoint VBA macro** that builds the full project
presentation (~27 slides) for you, themed in the app's colours
(primary `#2563EB`, secondary `#7C3AED`).

## How to run

1. Open **PowerPoint** (a blank presentation is fine).
2. Press **ALT + F11** to open the VBA editor.
3. Either:
   - **Import:** `File ▸ Import File…` → select `StudyBuddy_Deck.bas`, **or**
   - **Paste:** `Insert ▸ Module`, then paste the contents of the `.bas` file.
4. Press **F5** (or `Run ▸ Run Sub/UserForm`) and run **`BuildStudyBuddyDeck`**.
5. A new presentation is generated. **Save it as `StudyBuddy.pptx`**.

> If macros are blocked: `File ▸ Options ▸ Trust Center ▸ Trust Center Settings ▸
> Macro Settings ▸ Enable VBA macros`, then reopen PowerPoint.

## What it generates

Title slide → Agenda → **Overview** (intro/problem, objectives, scope, personas) →
**Design** (features, use cases, architecture, database, UI system) →
**HCI Principles** (Nielsen 10, Shneiderman 8, accessibility, UX) →
**Implementation** (frontend/backend, engineering highlights) →
**Evaluation** (heuristic results, statistical usability analysis, testing) →
**Wrap-up** (conclusion, future work) → Thank-you slide.

Section divider slides, gradient title slides, brand-coloured headers, and
two-level bullets are all created automatically. Content mirrors the project
docs in `../docs/`.

## Customising

- **Edit text:** change the `Array(...)` items in `BuildStudyBuddyDeck`.
  A leading `>` on a line makes it an indented sub-bullet.
- **Add a slide:** call `ContentSlide pres, "My Title", Array("point 1", "point 2")`.
- **Add a section break:** call `Divider pres, "My Section"`.
- **Colours:** edit the `cPrimary` / `cSecond` functions near the top.

Works on PowerPoint for Windows (Microsoft 365 / 2016+).
