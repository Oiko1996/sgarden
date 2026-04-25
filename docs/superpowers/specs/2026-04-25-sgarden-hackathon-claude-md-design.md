# SGarden Hackathon — CLAUDE.md Design Spec

**Date:** 2026-04-25
**Repo:** `/Users/oiiko96/walkauthon/sgarden`
**Author:** Brainstorming session, owner: oiiko96

---

## 1. Goal

Author a `CLAUDE.md` (and supporting files) that turns Claude Code into a disciplined, TDD-strict mission solver for the SGarden hackathon. The project ships a React/Express codebase with 20 missions encoded as Cypress smoke specs; each mission is scored by `data-testid` contract assertions. Total available: **2380 pts** (easy 460 + medium 1270 + hard 650).

The CLAUDE.md must:

- Auto-load enough project context that Claude can navigate the repo without re-discovering structure each session.
- Encode an enforceable, anti-shortcut workflow per mission (TDD-strict: RED → IMPLEMENT → GREEN → CYCLOPT → DONE).
- Wire a heavy Cyclopt MCP gate (sast + violations after every mission, critical/high MUST fix).
- Forbid autonomous git operations — the user commits manually at the end of the hackathon to avoid leaking work to other teams.
- Track live per-mission state in an inventory file.

## 2. Non-Goals

- Not a turnkey hackathon-winning script; the human still drives mission selection and pace.
- Not a replacement for project README — keep a tight focus on what Claude needs.
- Not a permanent docs surface; everything here is hackathon-scoped and disposable post-event.

## 3. File Architecture

Three files under `sgarden/`:

```
sgarden/
├── CLAUDE.md                         # Auto-loaded by Claude Code on session start
└── .claude/
    ├── missions-inventory.md         # Live state for all 20 missions + foundations
    └── cyclopt-followups.md          # Append-only log (created lazily on first medium/low finding)
```

**Responsibilities:**

| File | Purpose | Update cadence |
|---|---|---|
| `CLAUDE.md` | Project orientation + Mission Protocol + Cyclopt gate + hackathon constraints | Stable; rarely changes |
| `.claude/missions-inventory.md` | Single source of truth for mission status, testid contracts, foundations, totals | Updated at every Phase transition |
| `.claude/cyclopt-followups.md` | Deferred medium/low findings log | Append-only, lazy creation |

## 4. CLAUDE.md — Section Outline

In appearance order (hard gates first per Approach 2):

1. **ABSOLUTE RULES** — top-of-file callout, 4 lines max
2. **PROJECT MAP** — terse repo tree
3. **COMMANDS CHEATSHEET** — copy-pasteable
4. **CONVENTIONS & QUIRKS** — stack, lint, ports, kebab-case testid contract, etc.
5. **MISSION PROTOCOL** — the 6-phase TDD-strict state machine (Section 6 below)
6. **CYCLOPT GATE** — severity decision tree (Section 7 below)
7. **INVENTORY UPDATE PROTOCOL** — when/how to mutate `missions-inventory.md`
8. **ORDERING STRATEGY** — greedy ROI explained
9. **RED FLAGS / RATIONALIZATIONS TABLE** — anti-shortcut enforcement
10. **HACKATHON CONSTRAINTS (BOOKMARK REPEAT)** — repeats absolute rules at end of file

## 5. Project Orientation Content

### 5.1 Project map

```
sgarden/
├── frontend/                          # React 18 + CRA + craco (ESLint disabled in dev)
│   ├── src/
│   │   ├── api/index.js               # ky-based HTTP client — extend here for new endpoints
│   │   ├── components/                # Shared UI primitives — REUSE these
│   │   │   ├── Form.js, Table.js, Dialog.js, Snackbar.js, Buttons.js, Input.js
│   │   │   ├── Dropdown.js, RadioButtons.js, Switch.js, Slider.js, Checkbox.js
│   │   │   ├── Header.js, Sidebar.js, Footer.js, Card.js, Accordion.js, Popup.js
│   │   │   ├── Plot.js, Map.js, Spinner.js, Search.js, Tooltip.js, DatePicker.js
│   │   │   ├── ErrorFallback.js, AdminOnly.js, GuestOnly.js, Protected.js
│   │   ├── screens/                   # Route-level pages — add new pages here
│   │   │   ├── Dashboard.js, Dashboard1.js, Dashboard2.js
│   │   │   ├── Auth.js, SignIn.js, SignUp.js, ForgotPassword.js, ResetPassword.js
│   │   │   ├── InvitedSignUp.js, Users.js, NotFound.js
│   │   ├── utils/
│   │   │   ├── dayjs.js               # Date config
│   │   │   ├── jwt.js                 # JWT decode helpers
│   │   │   ├── validations.js         # Form validation helpers
│   │   │   ├── cookie.js, constants.js, capitalize.js
│   │   │   ├── adjust-colors.js, color-suggestion.js, is-fuzzy-match.js
│   │   │   ├── use-snackbar.js
│   │   ├── use-global-state.js        # zustand store — pattern for new stores
│   │   ├── index.js                   # Routes mount + providers; REGISTER NEW ROUTES HERE
│   │   ├── _colors.scss, index.scss
│   ├── cypress/
│   │   ├── e2e/smoke/                 # ⚠ THE CONTRACT
│   │   │   ├── 1-easy.cy.js           # M1–M8
│   │   │   ├── 2-medium.cy.js         # M9–M17
│   │   │   ├── 3-hard.cy.js           # M18–M20
│   │   ├── support/                   # cy.loginAsAdmin() lives here — DO NOT modify
│   │   ├── reporters/silent-reporter.js
│   ├── run-smoke-tests.js             # Wrapper runner (silent reporter, final summary)
│   ├── cypress.config.js              # baseUrl http://localhost:3002, env apiUrl http://localhost:4000/api
│   └── craco.config.cjs               # devServer.port = 3002, eslint.enable = false
├── backend/                           # Express 4 + Mongoose 6 (MongoDB)
│   ├── server.js                      # Bootstrap, JWT, helmet, cors, listens on PORT || 4000
│   ├── src/
│   │   ├── models/                    # Mongoose schemas
│   │   │   ├── index.js, user.js, invitation.js, reset.js
│   │   ├── routes/                    # Express routers
│   │   │   ├── index.js, data.js, info.js, public.js, user.js, user-system.js
│   │   ├── middleware/index.js        # Auth + error handling
│   │   ├── utils/
│   │   │   ├── attach-user.js, email.js, validation-schemas.js, validations.js, mongoose.js
│   ├── .env                           # Local — see .env.sample (DATABASE_URL, JWT_SECRET, ...)
├── scripts/
│   ├── run-smoke-with-services.mjs    # Boots backend + frontend, runs smoke, tears down
│   ├── seed-test-users.js             # Inserts test admin + regular users
│   ├── cypress.config.js
└── package.json                       # ⚠ ALL deps live here (root)
```

### 5.2 Commands cheatsheet

```sh
# Setup (once)
cd sgarden
npm install                            # Installs everything from root

# Dev (interactive)
npm run dev                            # backend + frontend in parallel
npm run frontend:start                 # frontend only (port 3002)
npm run backend:dev                    # backend only (port 4000, nodemon)

# Smoke tests (the score)
npm run smoke:test:auto                # Boots services + runs all smoke specs + report
npm run smoke:test                     # Runs against ALREADY-RUNNING services
npm run smoke:seed                     # Seed test users into DB

# Single mission run (TDD per-mission — preferred during Phase 2 + Phase 4)
cd sgarden/frontend && \
  npx cypress run \
    --spec cypress/e2e/smoke/{tier}.cy.js \
    --grep "M{N}:"
# tier ∈ {1-easy, 2-medium, 3-hard}
# Live per-mission points printed via cypress.config.js after-spec hook.

# Lint
npm run lint                           # both
npm run frontend:lint
npm run backend:lint

# Build
npm run frontend:build
npm run start:all                      # production-style
```

### 5.3 Conventions & quirks

**Critical:**

- `data-testid` is the contract — exact kebab-case. ANY typo = lost points.
- ⚠ Root `package.json` is the ONLY dep manifest. Never `npm install` inside `frontend/` or `backend/`.
- ⚠ ESLint config `iamnapo` + `iamnapo/react`. Strict. Cyclopt + lint will both complain on style violations.
- ⚠ Frontend dev port is **3002** (craco overrides CRA default 3000). Cypress baseUrl is `http://localhost:3002`. Backend on **4000**.
- Cypress timeouts: `defaultCommandTimeout: 3000`, `requestTimeout: 8000`, `pageLoadTimeout: 20000`. Keep components fast.
- `cy.loginAsAdmin()` is provided by `cypress/support/commands.js:25` — DO NOT redefine.

**Frontend stack (use these, do not introduce alternatives):**

- UI: `@mui/material` v5 + `@mui/icons-material` + `@emotion/{react,styled}`
- Date pickers: `@mui/x-date-pickers` + `dayjs` (configured in `utils/dayjs.js`)
- State (UI): `zustand` (see `use-global-state.js`)
- Server data: `swr`
- HTTP: `ky` (see `api/index.js`)
- Forms: `formik` + `yup`
- Routing: `react-router-dom` v6
- Charts: `react-plotly.js` (already wired in Dashboard1/Dashboard2)
- Maps: `react-simple-maps` (use for M14)
- Tables: `react-table-6` (legacy, but installed)
- Errors: `react-error-boundary`

**Backend stack:**

- Framework: Express 4
- DB: Mongoose 6 (MongoDB)
- Auth: `jsonwebtoken` + `bcryptjs`, JWT in cookies (`js-cookie` on frontend)
- Validation: yup schemas in `utils/validation-schemas.js`
- Email: `@sendgrid/mail` (`utils/email.js`)
- Logging: `morgan`
- Security: `helmet`, `cors`

**Test users (after `npm run smoke:seed`) — ⚠ DELETE BEFORE COMMITTING:**

```
admin / admin123    role=admin   email=admin@sgarden.test
user  / user1234    role=user    email=user@sgarden.test
DATABASE_URL default: mongodb://localhost:27017/testDB
```

**Known honeypot:** `backend/server.js:19` has `const unusedVariable = "I am not used";` — likely intentional to test the analyzer. DO NOT touch unless Cyclopt flags it in a file you are modifying for a mission.

## 6. Mission Protocol — TDD-strict State Machine

**Trigger:** User says "next mission: M_X", "let's do M_X", or "M_X".

**Pre-flight:** Create a TodoWrite with 6 todos, one per phase. Mark `in_progress` as you enter each phase. Mark `completed` only at phase exit.

### Phase 1 — BRIEF
- Read the mission's `describe` block in `frontend/cypress/e2e/smoke/{tier}.cy.js`.
- Extract testid contract: every `[data-testid="..."]` selector + its assertion (exists | be.visible | text not empty | within block).
- Note the route(s) under test (`cy.visit(...)`).
- Update inventory: status `TODO → RED`.
- **HARD GATE:** Do not proceed without testid contract written down (in TodoWrite or transcript). Phase 2 needs it.

### Phase 2 — RED (verify failing baseline)
- Ensure dev services are running. Ask user if unsure (`npm run dev`, or use `smoke:test:auto` which auto-boots).
- Run ONLY this mission's spec:
  ```sh
  cd sgarden/frontend && npx cypress run \
    --spec cypress/e2e/smoke/{tier}.cy.js \
    --grep "M{N}:"
  ```
- Confirm RED: at least one assertion fails for THIS mission. If GREEN already → mission solved → mark CYCLOPT-CLEAN, skip to Phase 5.
- **HARD GATE:** Never proceed to Phase 3 without observed RED output for this mission's testids. RED gate is strict ALWAYS, even if mission obviously absent.

### Phase 3 — IMPLEMENT (production scope)

Six moves, in order:

1. **Survey first (read-only):** Read/Grep before writing. Check existing routes (`frontend/src/index.js`), existing components, whether testids already exist (mission may be half-done).

2. **Foundation first:** If a foundation is shared across >1 mission, build it BEFORE the consumer:
   | Foundation | Used by |
   |---|---|
   | ThemeProvider (light/dark) | M2, M17 |
   | i18n provider + translations | M13, M17 |
   | Sidebar items registry | M5, M9, M10, M15, M16, M20 |
   | Notification store (zustand) | M6, M10 |
   | Activity/Audit logger | M5, M16 |
   | Bookmarks store | M3 |
   | Filter persistence (localStorage hook) | M7 |
   | Realtime client (websocket) | M18 |

   Foundations get their own row in the inventory under "Foundations" — track separately from missions.

3. **Frontend wiring:**
   - New page → `frontend/src/screens/{Name}.js`
   - Register route → `frontend/src/index.js`
   - Reusable bits → `frontend/src/components/`
   - HTTP → extend `frontend/src/api/index.js` (uses `ky`)
   - UI state → zustand store side-by-side with `use-global-state.js`
   - Server state → `swr`
   - Dates → `dayjs` via `utils/dayjs.js`
   - Stack consistency: MUI v5 + emotion. DO NOT introduce alternative UI libraries.

4. **Backend wiring (when persistence is testable):**
   - Mongoose model → `backend/src/models/{name}.js`, register in `models/index.js`
   - Express route → `backend/src/routes/{name}.js`, register in `routes/index.js`
   - Auth middleware → already exists (`backend/src/middleware/index.js`, `utils/attach-user.js`)
   - Validation → extend `backend/src/utils/validation-schemas.js`
   - DB → MongoDB via Mongoose, connection in `backend/server.js`

   Likely models: SalesRecord (M9), AlertRule + Alert (M10), Note (M11), MapDataEntry (M14), Report (M15), ActivityLog/AuditLog (M5/M16, possibly unified with `kind` discriminator), UserSettings (M17), ImportJob (M20).

5. **Wire real functionality, not shells:**
   - M2 dark mode → MUI theme palette switch (not just toggle).
   - M4 CSV export → real blob + download trigger (not console.log).
   - M3 bookmarks → persist (localStorage or UserSettings backend).
   - M18 realtime → real websocket (not fake "Connected" status).
   - **⚠ EXPLICIT BAN: Frontend mock data is FORBIDDEN when backend persistence is testable.** Production scope chosen — no shortcuts.

6. **Testid precision (final touch):**
   - Exact-match string. Kebab-case. No typos.
   - Place testid on the correct element (root container for `*-page`, button itself for `*-button`).
   - `should('be.visible')` requires non-zero size and not `display: none`.
   - `within` blocks require descendant relationship in DOM, not siblings.
   - Before Phase 4: grep each testid in the contract and confirm it exists exactly as written.

### Phase 4 — GREEN (verify pass)
- Re-run THIS mission's spec (same command as Phase 2).
- Confirm all assertions for THIS mission pass.
- If RED → read failure, fix, re-run. Loop until GREEN.
- Update inventory: status `RED → GREEN`.
- **HARD GATE:** Never proceed to Phase 5 with any failure for this mission's assertions.

### Phase 5 — CYCLOPT (heavy gate)
- For each modified/created file in this mission (frontend AND backend — components, screens, models, routes, validation schemas, anything you touched in Phase 3):
  ```
  mcp__cyclopt__analyze_sast(file_path)
  mcp__cyclopt__analyze_violations(file_path)
  ```
- (Do NOT run `analyze_metrics` per-mission — that is a final-sweep tool.)
- Triage by severity (see Section 7).
- Re-run after fixes. Max 2 retries; on 3rd loop, STOP and ask user.
- If any fix changes behavior → loop back to Phase 4 before exiting Phase 5.
- Update inventory: status `GREEN → CYCLOPT-CLEAN`.
- **HARD GATE:** Never transition to CYCLOPT-CLEAN with any unresolved critical or high finding.

### Phase 6 — DONE
- Update inventory: status `CYCLOPT-CLEAN → DONE`, add timestamp + notes.
- Report to user: 1-line summary, points earned, deferred-finding count.
- ⚠ **DO NOT commit.** Wait for user's explicit instruction.
- Wait for user to say "next: M_Y" before starting another mission.

## 7. Cyclopt Gate — Severity Decision Tree

| Severity | Action |
|---|---|
| CRITICAL | MUST FIX NOW. No exceptions. Re-run Phase 4 if behavior changed. |
| HIGH | MUST FIX NOW. No exceptions. Same re-run rule. |
| MEDIUM | Append to `.claude/cyclopt-followups.md`. DO NOT fix mid-mission unless trivial (1-line, no behavior risk). |
| LOW | Append to `.claude/cyclopt-followups.md`. NEVER fix mid-mission. |
| INFO | Ignore. Do not log. |

**False positives:** Still log them with explicit "deferred-critical-needs-review" status and ask user to confirm before proceeding past the gate.

**Cannot-fix scenarios:** If a critical/high finding cannot be fixed without breaking the cypress contract — STOP and ask user. Mark mission `BLOCKED` in inventory with reason.

**Followup log template** (`.claude/cyclopt-followups.md`):

```markdown
## M{N} — {mission title} — {YYYY-MM-DD HH:MM}

- **File**: `path/to/file.js`
- **Severity**: medium | low | (deferred-critical-needs-review)
- **Rule**: {cyclopt rule id}
- **Summary**: {one line}
- **Decision**: defer | accept-as-is | needs-user-input
- **Reason**: {why deferred}
```

## 8. Inventory File Format

`.claude/missions-inventory.md` is pre-populated at session 1 with all 20 missions and foundations. Updated at every phase transition.

```markdown
# SGarden Missions Inventory

Last updated: {YYYY-MM-DD HH:MM}
Status legend: TODO · RED · GREEN · CYCLOPT-CLEAN · DONE · BLOCKED

| ID  | Title                              | Tier   | Pts | Route(s)        | Status | Notes |
|-----|------------------------------------|--------|-----|-----------------|--------|-------|
| M1  | User Profile Page                  | easy   | 50  | /profile        | TODO   |       |
| M2  | Dark Mode Toggle                   | easy   | 50  | /dashboard      | TODO   |       |
| M3  | Dashboard Bookmarks                | easy   | 60  | /dashboard*     | TODO   |       |
| M4  | CSV Export for Charts              | easy   | 60  | /dashboard,2    | TODO   |       |
| M5  | Activity Log                       | easy   | 80  | /activity       | TODO   |       |
| M6  | Notification Center                | easy   | 50  | header global   | TODO   |       |
| M7  | Dashboard Filter Persistence       | easy   | 50  | /dashboard1     | TODO   |       |
| M8  | Breadcrumb Navigation              | easy   | 60  | global auth     | TODO   |       |
| M9  | Sales Records CRUD                 | medium | 150 | /sales-data     | TODO   |       |
| M10 | Threshold Alerts System            | medium | 150 | /alerts         | TODO   |       |
| M11 | In-App Notes & Annotations         | medium | 120 | /dashboard1     | TODO   |       |
| M12 | Data Comparison Mode               | medium | 150 | /dashboard1     | TODO   |       |
| M13 | Multi-Language Support / i18n      | medium | 120 | header global   | TODO   |       |
| M14 | Map-Based Data Entry               | medium | 180 | /map            | TODO   |       |
| M15 | Report Builder                     | medium | 180 | /reports        | TODO   |       |
| M16 | Audit Trail                        | medium | 120 | /audit          | TODO   |       |
| M17 | User Preferences & Settings        | medium | 100 | /settings       | TODO   |       |
| M18 | Real-Time Collaborative Dashboard  | hard   | 250 | /dashboard      | TODO   |       |
| M19 | Advanced Search & Global Filter    | hard   | 200 | header global   | TODO   |       |
| M20 | CSV/JSON Data Import               | hard   | 200 | /import         | TODO   |       |

**Totals:** 20 missions · 0 DONE · 0 / 2380 pts earned

---

## Foundations

| Foundation                           | Used by                       | Status | Files                       |
|--------------------------------------|-------------------------------|--------|-----------------------------|
| ThemeProvider                        | M2, M17                       | TODO   |                             |
| i18n provider                        | M13, M17                      | TODO   |                             |
| Sidebar registry                     | M5, M9, M10, M15, M16, M20    | TODO   |                             |
| Notification store (zustand)         | M6, M10                       | TODO   |                             |
| Activity/Audit logger                | M5, M16                       | TODO   |                             |
| Bookmarks store                      | M3                            | TODO   |                             |
| Filter persistence hook              | M7                            | TODO   |                             |
| Realtime client                      | M18                           | TODO   |                             |

---

## Per-mission detail (pre-populated for all 20)

### M1 — User Profile Page (50 pts) · easy · /profile

**Status:** TODO · last updated: —

**Auth:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')` (per spec).

**Testid contract:**
- `profile-nav-link` — clickable, navigates to profile-page
- `profile-page` — visible after click
- `profile-username`, `profile-email`, `profile-role`, `profile-created-at`, `profile-last-active` — visible, non-empty text
- `profile-edit-button` — click reveals profile-save-button
- `profile-save-button` — visible after edit
- `profile-password-current`, `profile-password-new`, `profile-password-confirm`, `profile-password-save` — exist

**Implementation notes** (filled on Phase 6):
- Files touched: —
- Foundations added/extended: —
- Backend models/routes added: —
- Deferred Cyclopt findings: —
- Time: —

### M2 — ... (same template, all 20 pre-populated)
```

**Update protocol** (also written in CLAUDE.md):
- Phase 1: expand per-mission detail section, fill testid contract
- Phase 2: status `TODO → RED` in summary table
- Phase 4: status `RED → GREEN`
- Phase 5: status `GREEN → CYCLOPT-CLEAN`
- Phase 6: status `CYCLOPT-CLEAN → DONE`, fill notes, recompute totals
- BLOCKED: only when STOP+ask user; include reason in notes

**Total points:** 2380 (easy 460 + medium 1270 + hard 650). Computed from cypress spec headers.

## 9. Ordering Strategy

**Default (greedy ROI):**

1. **Easy tier (M1–M8):** quick wins, low risk. ≈ 460 pts.
2. **Medium tier (M9–M17), easier-first sub-order:**
   - First: M11 (notes, light backend), M13 (i18n, mostly frontend), M16 (audit, similar to M5), M17 (settings, simple form)
   - Then: M9 (sales CRUD), M10 (alerts, depends on notification store), M14 (map + form), M15 (report builder)
3. **Hard tier (M18–M20):** M19 (search dialog) → M20 (import) → M18 (websocket LAST, riskiest).

**User override:** Any time, "next: M_X" jumps to that mission, regardless of order.

## 10. Red Flags / Rationalizations Table

Goes inside CLAUDE.md as Section 9. Anti-shortcut enforcement.

| Thought | Reality |
|---|---|
| "It's just a small Cyclopt finding" | Heavy gate. Fix it (if critical/high) or log it (if medium/low). |
| "Tests pass, I'll skip Cyclopt this once" | Phase 5 is mandatory. Run it. |
| "Let me commit this real quick" | NEVER. User commits at the end. |
| "I'll mock data on the frontend, faster" | Production scope. Backend if testable. |
| "I'll batch M1, M2, M3 then run smoke" | One mission at a time. Smoke per mission. |
| "RED gate is silly, the mission obviously isn't done" | Strict always. Run it. |
| "False positive, I'll skip" | Log it as deferred-critical, ask user. |
| "I'll skip survey, I know what to write" | Always survey first. Foundations might already exist. |

## 11. Hackathon Constraints (Bookmark Repeat)

Repeated at end of CLAUDE.md as a closing reminder:

- NEVER `git commit`, `git push`, `git add` autonomously. User does git.
- NEVER skip Phase 5 (Cyclopt). Heavy gate is non-negotiable.
- NEVER frontend-mock data when backend persistence is testable.
- NEVER batch-implement multiple missions before running smoke per-mission.
- Order: easy → medium-light → medium-heavy → hard → M18 last. User can override.

## 12. Implementation Plan (handoff to writing-plans skill)

This spec defines WHAT to build. The writing-plans skill will produce a step-by-step plan for HOW to assemble these files. Likely steps:

1. Create `sgarden/.claude/` directory.
2. Compute exact total points from cypress specs (sum of `Pts` per mission).
3. Extract per-mission testid contracts from each cypress spec into pre-populated inventory rows.
4. Write `sgarden/.claude/missions-inventory.md` (full pre-population for all 20 missions + foundations).
5. Write `sgarden/CLAUDE.md` (sections 1–10 above, in order).
6. Verify both files render readably (Read them back, line counts sane).
7. Sanity-check: confirm no test creds, route paths, or testids contain typos against the cypress specs.

`.claude/cyclopt-followups.md` is created lazily by the protocol on first medium/low finding — not pre-created.

## 13. Out of Scope for This Spec

- Per-mission implementation details (those happen during Phase 3 of the protocol, not in this design).
- Cleanup PR / spec deletion plan post-hackathon (the user will handle removal of credentials and these files).
- CI integration (no CI in this hackathon).
- Multi-team coordination (solo work, autonomous).
