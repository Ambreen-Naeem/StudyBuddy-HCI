'==============================================================================
'  StudyBuddy - HCI Project Presentation Generator (VBA for PowerPoint)
'------------------------------------------------------------------------------
'  HOW TO RUN
'   1. Open PowerPoint (a blank presentation is fine).
'   2. Press ALT+F11 to open the VBA editor.
'   3. Insert > Module.
'   4. Paste ALL of this code into the module.
'   5. Press F5 (or Run > Run Sub) and run  BuildStudyBuddyDeck.
'   6. A new, fully built presentation appears. Save it as StudyBuddy.pptx.
'
'  Tested on PowerPoint for Windows (Microsoft 365 / 2016+).
'==============================================================================
Option Explicit

' ----- Slide dimensions (filled in at runtime) -----
Private SW As Single
Private SH As Single
Private Const FONT_NAME As String = "Segoe UI"

' ----- Brand palette (precomputed Long values = RGB) -----
Private Function cPrimary() As Long
    cPrimary = RGB(37, 99, 235)        ' #2563EB
End Function
Private Function cSecond() As Long
    cSecond = RGB(124, 58, 237)        ' #7C3AED
End Function
Private Function cInk() As Long
    cInk = RGB(30, 41, 59)             ' slate-800
End Function
Private Function cMuted() As Long
    cMuted = RGB(71, 85, 105)          ' slate-600
End Function
Private Function cWhite() As Long
    cWhite = RGB(255, 255, 255)
End Function
Private Function cSoftBlue() As Long
    cSoftBlue = RGB(219, 234, 254)     ' blue-100
End Function

'==============================================================================
'  MAIN
'==============================================================================
Public Sub BuildStudyBuddyDeck()
    Dim pres As Presentation
    Set pres = Application.Presentations.Add(msoTrue)

    On Error Resume Next
    pres.PageSetup.SlideSize = ppSlideSizeOnScreen16x9
    On Error GoTo 0

    SW = pres.PageSetup.SlideWidth
    SH = pres.PageSetup.SlideHeight

    ' ---------- 1. Title ----------
    TitleSlide pres, "StudyBuddy", _
        "Find study partners - build study groups - track progress", _
        "A Human-Computer Interaction (HCI) Semester Project"

    ' ---------- 2. Agenda ----------
    ContentSlide pres, "Agenda", Array( _
        "Introduction, problem & objectives", _
        "Users & personas", _
        "Features, use cases & system architecture", _
        "Database & UI design system", _
        "HCI principles: Nielsen, Shneiderman, accessibility, UX", _
        "Implementation (React + Flask)", _
        "Evaluation: heuristic + statistical usability analysis", _
        "Conclusion & future work")

    Divider pres, "1. Overview"

    ContentSlide pres, "Introduction & Problem Statement", Array( _
        "Students struggle to find compatible study partners and stay organised.", _
        "Syllabi are unstructured; progress is hard to see; deadlines slip.", _
        ">Existing tools are generic (chat / to-do apps), not study-centred.", _
        "StudyBuddy unifies matching, study groups, syllabus breakdown,", _
        ">progress tracking, planning and notifications in one web app.", _
        "Designed and evaluated with formal HCI methods.")

    ContentSlide pres, "Objectives", Array( _
        "Let students create rich academic profiles.", _
        "Auto-match students into study groups by subject / semester / skill.", _
        "Break a syllabus into weekly topics automatically.", _
        "Track completion %, weekly targets and a study streak.", _
        "Plan tasks & deadlines (weekly / monthly).", _
        "Apply and verify major HCI usability principles throughout.")

    ContentSlide pres, "Scope", Array( _
        "IN SCOPE:", _
        ">Accounts & profiles, group matching, study groups + discussion", _
        ">Syllabus breakdown, progress tracking, planner, notifications, dashboard", _
        ">Responsive web (desktop / tablet / mobile), light & dark themes", _
        "OUT OF SCOPE:", _
        ">Native mobile apps, real-time video, payments, LMS integration")

    ContentSlide pres, "Target Users & Personas", Array( _
        "Primary users: university students.", _
        "Aisha - organised high-achiever; wants efficiency & shortcuts.", _
        "Daniel - struggling first-year; needs guidance & low cognitive load.", _
        "Maria - part-time / working student; needs flexible scheduling.", _
        ">Personas drove navigation, feedback and accessibility decisions.")

    Divider pres, "2. Design"

    ContentSlide pres, "Key Features", Array( _
        "Smart study-group matching + join requests / accept / reject", _
        "Study groups: members, discussion board, group progress, admin tools", _
        "Syllabus breakdown -> Week 1 / Topic A, Week 2 / Topic B ...", _
        "Progress tracking: bars, %, weekly targets, remaining topics, streak", _
        "Planner: tasks & deadlines, weekly / monthly views", _
        "Dashboard + notifications (invites, deadlines, reminders, requests)")

    ContentSlide pres, "Use Cases", Array( _
        "Actors: Student, Group Admin, System.", _
        "Register / Login / Manage profile", _
        "Find & match group; create / join / leave group", _
        "Accept/reject requests; add/remove members (admin)", _
        "Add subject & syllabus; auto-generate weekly topics", _
        "Mark topics complete; add tasks; receive notifications", _
        ">12+ formal use cases documented with main & alternative flows.")

    ContentSlide pres, "System Architecture (3-tier)", Array( _
        "Client: React SPA (Vite + Tailwind + React Router).", _
        "API: Python Flask REST + JWT authentication.", _
        "Data: SQLite via SQLAlchemy ORM.", _
        ">React  <-- JSON/HTTPS -->  Flask REST  <-->  SQLite", _
        "Stateless JWT auth; axios interceptor attaches Bearer token.", _
        "Component-based frontend; Blueprint-based backend.")

    ContentSlide pres, "Database Design", Array( _
        "11 normalised (3NF) tables:", _
        ">Users, Subjects, StudyGroups, GroupMembers, GroupJoinRequests", _
        ">Syllabus, Topics, Progress, Tasks, Notifications, DiscussionPosts", _
        "Relationships: 1:N (User->Subjects), M:N (Users<->Groups via members)", _
        "Self-referencing DiscussionPosts (parent_id) for threaded replies.", _
        ">Full ER diagram + SQL schema in the project docs.")

    ContentSlide pres, "UI Design System", Array( _
        "Colour: Primary #2563EB, Secondary #7C3AED, success/warning/error.", _
        ">Colour-blind friendly + WCAG AA contrast in light & dark.", _
        "Typography: Inter / system stack with a clear type scale.", _
        "Components: buttons, inputs, cards, modals, toasts, progress bars.", _
        "Rounded-2xl glassy cards, gradient accents, soft shadows.", _
        "Wireframes -> hi-fi mockups for all key screens.")

    Divider pres, "3. HCI Principles"

    ContentSlide pres, "Nielsen's 10 Usability Heuristics", Array( _
        "Visibility of status: toasts, spinners, progress bars.", _
        "Match real world: weeks, subjects, 'study streak' language.", _
        "User control & freedom: leave group, cancel, Esc closes modals.", _
        "Consistency & standards: shared component library.", _
        "Error prevention: validation + confirm dialogs.", _
        "Recognition not recall: recommended groups, prefilled forms.", _
        "Flexibility: keyboard nav, weekly/monthly toggle, dark mode.", _
        "Minimalist design; error recovery; help & documentation.")

    ContentSlide pres, "Shneiderman's 8 Golden Rules", Array( _
        "Consistency across all screens.", _
        "Shortcuts: keyboard navigation & skip links for frequent users.", _
        "Informative feedback for every action.", _
        "Dialogs that yield closure (clear success states).", _
        "Simple error handling with inline messages.", _
        "Easy reversal of actions (cancel / confirm).", _
        "Internal locus of control - the user is in charge.", _
        "Reduce short-term memory load (visible nav, previews).")

    ContentSlide pres, "Accessibility", Array( _
        "Semantic HTML + ARIA labels, roles and live regions.", _
        "Full keyboard navigation; visible focus rings; skip link.", _
        "Modal focus trap + focus restoration.", _
        "Colour-blind friendly: status by icon + text, not colour alone.", _
        "Responsive layouts; respects prefers-reduced-motion.", _
        "WCAG AA contrast in both light and dark themes.")

    ContentSlide pres, "UX Principles", Array( _
        "User-centred design driven by personas & testing.", _
        "Simple, always-visible navigation (sidebar + navbar).", _
        "Clear feedback on every interaction.", _
        "Minimal cognitive load (capped lists, empty states).", _
        "Strong visual hierarchy (headings, cards, badges).", _
        "Progressive disclosure (details revealed when needed).")

    Divider pres, "4. Implementation"

    ContentSlide pres, "Implementation - Frontend & Backend", Array( _
        "Frontend: React 18, Vite, Tailwind, React Router, Context + hooks.", _
        ">16 reusable components, 14 pages, JWT axios client.", _
        "Backend: Flask app-factory + Blueprints, SQLAlchemy models.", _
        ">REST endpoints for auth, groups, syllabus, progress, tasks, etc.", _
        "Auto-seeded demo database for instant demoing.", _
        "Build verified: 117 modules, no errors.")

    ContentSlide pres, "Engineering Highlights", Array( _
        "Fixed a systemic API contract mismatch:", _
        ">frontend camelCase  <-->  backend snake_case", _
        ">solved globally with axios request/response interceptors.", _
        "Repaired notifications mark-read & planner task completion.", _
        "Added a flashy redesign + persistent light / dark theme toggle.", _
        "All changes verified end-to-end against the live API.")

    Divider pres, "5. Evaluation"

    ContentSlide pres, "Heuristic Evaluation Results", Array( _
        "Expert inspection against Nielsen's 10 heuristics (0-4 severity).", _
        "Result: 0 catastrophic, 6 major, 24 minor, 24 cosmetic issues.", _
        "Strongest: consistency, visibility, accessibility.", _
        "Weakest: help & documentation (onboarding).", _
        "Prioritised P0 fix list produced (confirm dialogs, undo, help).", _
        ">Every finding cited to a specific screen / component.")

    ContentSlide pres, "Statistical Usability Analysis", Array( _
        "Task time (new vs old UI): 41.3s vs 60.4s,", _
        ">independent t(28)=8.91, p<.001, d=3.25 (very large).", _
        "SUS usability: 56 -> 80 (Wilcoxon z=-2.52, p=.012).", _
        "Mann-Whitney U confirms speed gain (p<.001).", _
        "Comfort vs speed: Spearman rho=-0.89 (p<.001).", _
        "Chi-square: task success depends on UI (p=.013).")

    ContentSlide pres, "Usability Testing", Array( _
        "Moderated, task-based testing with 5-8 students.", _
        "Metrics: task success, time on task, error rate, SUS.", _
        "12 task scenarios with success criteria.", _
        "System Usability Scale questionnaire + scoring.", _
        "Content analysis of open feedback into themes.", _
        ">Triangulated with the heuristic evaluation.")

    Divider pres, "6. Wrap-up"

    ContentSlide pres, "Conclusion", Array( _
        "StudyBuddy delivers a complete, study-focused web app.", _
        "Major HCI principles applied AND verified, not just claimed.", _
        "Statistically significant, large usability improvements.", _
        "Accessible, responsive, and themeable (light / dark).", _
        ">A submission-ready HCI semester project, end to end.")

    ContentSlide pres, "Future Work", Array( _
        "Onboarding tour + in-app help (top usability gap).", _
        "Undo + confirmation on all destructive actions.", _
        "Real-time notifications (WebSocket) & calendar sync.", _
        "Native mobile apps and offline mode.", _
        "Larger-sample usability study to settle theme preference.")

    ' ---------- Closing ----------
    TitleSlide pres, "Thank You", "Questions & Discussion", "StudyBuddy - HCI Project"

    MsgBox "StudyBuddy deck created: " & pres.Slides.Count & " slides." & vbCrLf & _
           "Now save it as StudyBuddy.pptx.", vbInformation, "Done"
End Sub

'==============================================================================
'  HELPERS
'==============================================================================
Private Sub TitleSlide(pres As Presentation, ttl As String, sub1 As String, sub2 As String)
    Dim sld As Slide
    Dim bg As Shape
    Dim tb As Shape
    Set sld = pres.Slides.Add(pres.Slides.Count + 1, ppLayoutBlank)

    Set bg = sld.Shapes.AddShape(msoShapeRectangle, 0, 0, SW, SH)
    bg.Line.Visible = msoFalse
    bg.Fill.ForeColor.RGB = cPrimary()
    bg.Fill.BackColor.RGB = cSecond()
    On Error Resume Next
    bg.Fill.TwoColorGradient msoGradientDiagonalUp, 1
    On Error GoTo 0

    Set tb = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, SW * 0.08, SH * 0.33, SW * 0.84, SH * 0.4)
    With tb.TextFrame.TextRange
        .Text = ttl & vbCrLf & sub1 & vbCrLf & sub2
        .Font.Name = FONT_NAME
        .Font.Color.RGB = cWhite()
        .Paragraphs(1).Font.Size = 48
        .Paragraphs(1).Font.Bold = msoTrue
        .Paragraphs(2).Font.Size = 22
        .Paragraphs(2).ParagraphFormat.SpaceBefore = 10
        .Paragraphs(3).Font.Size = 16
        .Paragraphs(3).Font.Color.RGB = cSoftBlue()
    End With
End Sub

Private Sub Divider(pres As Presentation, ttl As String)
    Dim sld As Slide
    Dim bg As Shape
    Dim tb As Shape
    Dim ac As Shape
    Set sld = pres.Slides.Add(pres.Slides.Count + 1, ppLayoutBlank)

    Set bg = sld.Shapes.AddShape(msoShapeRectangle, 0, 0, SW, SH)
    bg.Line.Visible = msoFalse
    bg.Fill.ForeColor.RGB = cInk()

    Set ac = sld.Shapes.AddShape(msoShapeRectangle, SW * 0.08, SH * 0.4, SW * 0.12, 6)
    ac.Line.Visible = msoFalse
    ac.Fill.ForeColor.RGB = cSecond()

    Set tb = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, SW * 0.08, SH * 0.42, SW * 0.84, SH * 0.2)
    With tb.TextFrame.TextRange
        .Text = ttl
        .Font.Name = FONT_NAME
        .Font.Size = 40
        .Font.Bold = msoTrue
        .Font.Color.RGB = cWhite()
    End With
End Sub

Private Sub ContentSlide(pres As Presentation, ttl As String, items As Variant)
    Dim sld As Slide
    Set sld = pres.Slides.Add(pres.Slides.Count + 1, ppLayoutBlank)
    Header sld, ttl
    Bullets sld, items
End Sub

Private Sub Header(sld As Slide, ttl As String)
    Dim bar As Shape
    Set bar = sld.Shapes.AddShape(msoShapeRectangle, 0, 0, SW, SH * 0.135)
    bar.Line.Visible = msoFalse
    bar.Fill.ForeColor.RGB = cPrimary()
    bar.TextFrame.MarginLeft = SW * 0.04
    bar.TextFrame.VerticalAnchor = msoAnchorMiddle
    With bar.TextFrame.TextRange
        .Text = ttl
        .Font.Name = FONT_NAME
        .Font.Size = 26
        .Font.Bold = msoTrue
        .Font.Color.RGB = cWhite()
    End With
End Sub

Private Sub Bullets(sld As Slide, items As Variant)
    Dim i As Long
    Dim k As Long
    Dim n As Long
    n = UBound(items) - LBound(items) + 1

    Dim lvl() As Integer
    ReDim lvl(1 To n)

    Dim s As String
    Dim ln As String
    k = 0
    For i = LBound(items) To UBound(items)
        k = k + 1
        ln = CStr(items(i))
        If Left(ln, 1) = ">" Then
            lvl(k) = 2
            ln = Trim(Mid(ln, 2))
        Else
            lvl(k) = 1
        End If
        If k > 1 Then s = s & vbCrLf
        s = s & ln
    Next i

    Dim tb As Shape
    Set tb = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, _
        SW * 0.05, SH * 0.18, SW * 0.9, SH * 0.76)
    With tb.TextFrame.TextRange
        .Text = s
        .Font.Name = FONT_NAME
        .Font.Color.RGB = cInk()
    End With

    Dim par As TextRange
    For k = 1 To tb.TextFrame.TextRange.Paragraphs.Count
        Set par = tb.TextFrame.TextRange.Paragraphs(k)
        par.IndentLevel = lvl(k)
        par.ParagraphFormat.SpaceAfter = 8
        On Error Resume Next
        par.ParagraphFormat.Bullet.Visible = msoTrue
        On Error GoTo 0
        If lvl(k) = 1 Then
            par.Font.Size = 19
            par.Font.Color.RGB = cInk()
        Else
            par.Font.Size = 16
            par.Font.Color.RGB = cMuted()
        End If
    Next k
End Sub
