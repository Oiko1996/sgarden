# SGarden Hackathon — CLAUDE.md Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author `sgarden/CLAUDE.md` plus `sgarden/.claude/missions-inventory.md` so that Claude Code is auto-loaded with project context, a TDD-strict mission protocol, a heavy Cyclopt MCP gate, and live mission state — enabling disciplined per-mission execution of all 20 SGarden hackathon missions (2380 pts total).

**Architecture:** Two stable docs files at `sgarden/CLAUDE.md` and `sgarden/.claude/missions-inventory.md`. A third file (`.claude/cyclopt-followups.md`) is created lazily by the protocol on the first deferred medium/low Cyclopt finding — NOT pre-created. NO git commits anywhere in this plan: the user explicitly retains control of all git operations.

**Tech Stack:** Plain Markdown. No code, no scripts, no dependencies. Source of truth for content: spec at [docs/superpowers/specs/2026-04-25-sgarden-hackathon-claude-md-design.md](../specs/2026-04-25-sgarden-hackathon-claude-md-design.md).

**Reference materials (read once before starting Task 2):**
- Cypress contracts: [frontend/cypress/e2e/smoke/1-easy.cy.js](../../../frontend/cypress/e2e/smoke/1-easy.cy.js), [2-medium.cy.js](../../../frontend/cypress/e2e/smoke/2-medium.cy.js), [3-hard.cy.js](../../../frontend/cypress/e2e/smoke/3-hard.cy.js)
- Cypress config: [frontend/cypress.config.js](../../../frontend/cypress.config.js)
- Craco config: [frontend/craco.config.cjs](../../../frontend/craco.config.cjs)
- Backend bootstrap: [backend/server.js](../../../backend/server.js)
- Seed users: [scripts/seed-test-users.js](../../../scripts/seed-test-users.js)
- Login helper: [frontend/cypress/support/commands.js:25](../../../frontend/cypress/support/commands.js#L25)

**File structure produced by this plan:**

```
sgarden/
├── CLAUDE.md                          # Created by Task 3
└── .claude/
    └── missions-inventory.md          # Created by Task 2
```

**File-level responsibilities:**
- `CLAUDE.md` — Stable: project orientation + Mission Protocol + Cyclopt gate + hackathon constraints. Auto-loaded by Claude Code at session start. Single, self-contained file (no chained reads required to start working).
- `.claude/missions-inventory.md` — Live: per-mission status, testid contracts, foundations registry. Updated at every Phase transition during mission execution.

**No git operations.** This plan deliberately omits commit steps. The user runs all git commands manually. Do NOT execute `git add`, `git commit`, or `git push` at any point.

---

## Task 1: Create `.claude/` directory

**Files:**
- Create directory: `sgarden/.claude/`

- [ ] **Step 1: Verify the directory does not yet exist (or is empty of relevant files)**

Run: `ls /Users/oiiko96/walkauthon/sgarden/.claude/ 2>/dev/null || echo "MISSING"`

Expected output: either `MISSING`, or a listing that may contain only `scheduled_tasks.lock` (created earlier by an unrelated Claude Code session) — both are fine. If you see existing `missions-inventory.md` or other content, STOP and ask the user whether to overwrite.

- [ ] **Step 2: Create the directory**

Run: `mkdir -p /Users/oiiko96/walkauthon/sgarden/.claude`

- [ ] **Step 3: Verify**

Run: `ls -la /Users/oiiko96/walkauthon/sgarden/.claude/`

Expected: directory exists. (May contain `scheduled_tasks.lock` — leave it alone.)

---

## Task 2: Author `.claude/missions-inventory.md`

**Files:**
- Create: `sgarden/.claude/missions-inventory.md`

This file is pre-populated for all 20 missions and 8 foundations. It is the live source of truth that the Mission Protocol updates during execution.

- [ ] **Step 1: Sanity-check the testid contracts against the cypress specs before writing**

This task transcribes the contracts from cypress into the inventory. Before writing, verify the spec line counts (so a contract did not silently change since brainstorming):

Run: `wc -l /Users/oiiko96/walkauthon/sgarden/frontend/cypress/e2e/smoke/*.cy.js`

Expected: `225 1-easy.cy.js`, `268 2-medium.cy.js`, `77 3-hard.cy.js` (total 570). If the numbers differ → STOP, re-read the changed file, and update the per-mission contracts in Step 2 to match what the spec currently says.

- [ ] **Step 2: Write the complete inventory file**

Use the Write tool to create `/Users/oiiko96/walkauthon/sgarden/.claude/missions-inventory.md` with EXACTLY this content (copy literally — kebab-case testids must match cypress specs character-for-character):

````markdown
# SGarden Missions Inventory

> Live state for the SGarden hackathon. Updated at every Phase transition by the Mission Protocol in `CLAUDE.md`.
> Status legend: **TODO** · **RED** · **GREEN** · **CYCLOPT-CLEAN** · **DONE** · **BLOCKED**

**Last updated:** 2026-04-25 (initial pre-population)

## Summary

| ID  | Title                              | Tier   | Pts | Route(s)                         | Status | Notes |
|-----|------------------------------------|--------|-----|----------------------------------|--------|-------|
| M1  | User Profile Page                  | easy   | 50  | /profile (new)                   | TODO   |       |
| M2  | Dark Mode Toggle                   | easy   | 50  | header (global)                  | TODO   |       |
| M3  | Dashboard Bookmarks                | easy   | 60  | /dashboard, /dashboard1, /dashboard2 | TODO |     |
| M4  | CSV Export for Charts              | easy   | 60  | /dashboard, /dashboard2          | TODO   |       |
| M5  | Activity Log                       | easy   | 80  | /activity (new)                  | TODO   |       |
| M6  | Notification Center                | easy   | 50  | header (global)                  | TODO   |       |
| M7  | Dashboard Filter Persistence       | easy   | 50  | /dashboard1                      | TODO   |       |
| M8  | Breadcrumb Navigation              | easy   | 60  | global (authenticated)           | TODO   |       |
| M9  | Sales Records CRUD                 | medium | 150 | /sales-data (new, inferred)      | TODO   |       |
| M10 | Threshold Alerts System            | medium | 150 | /alerts (new, inferred)          | TODO   |       |
| M11 | In-App Notes & Annotations         | medium | 120 | /dashboard1                      | TODO   |       |
| M12 | Data Comparison Mode               | medium | 150 | /dashboard1                      | TODO   |       |
| M13 | Multi-Language Support / i18n      | medium | 120 | header (global)                  | TODO   |       |
| M14 | Map-Based Data Entry               | medium | 180 | /map (new)                       | TODO   |       |
| M15 | Report Builder                     | medium | 180 | /reports (new, inferred)         | TODO   |       |
| M16 | Audit Trail                        | medium | 120 | /audit (new, inferred)           | TODO   |       |
| M17 | User Preferences & Settings        | medium | 100 | /settings (new, inferred)        | TODO   |       |
| M18 | Real-Time Collaborative Dashboard  | hard   | 250 | /dashboard                       | TODO   |       |
| M19 | Advanced Search & Global Filter    | hard   | 200 | header (global)                  | TODO   |       |
| M20 | CSV/JSON Data Import               | hard   | 200 | /import (new, inferred)          | TODO   |       |

**Totals:** 20 missions · 0 DONE · 0 / 2380 pts earned
(easy 460 + medium 1270 + hard 650)

## Foundations (cross-cutting infrastructure)

Build BEFORE the consumer mission. Each foundation gets its own row; status mirrors mission states.

| Foundation                              | Used by                              | Status | Files                              |
|-----------------------------------------|--------------------------------------|--------|------------------------------------|
| ThemeProvider (light/dark, MUI palette) | M2, M17                              | TODO   |                                    |
| i18n provider + EN/EL translations      | M13, M17                             | TODO   |                                    |
| Sidebar items registry                  | M5, M9, M10, M15, M16, M20           | TODO   |                                    |
| Notification store (zustand)            | M6, M10                              | TODO   |                                    |
| Activity/Audit logger (backend + UI)    | M5, M16                              | TODO   |                                    |
| Bookmarks store (localStorage or DB)    | M3                                   | TODO   |                                    |
| Filter persistence hook (localStorage)  | M7                                   | TODO   |                                    |
| Realtime client (websocket)             | M18                                  | TODO   |                                    |

---

## Per-Mission Detail

Each section is expanded on Phase 1 (BRIEF) and finalised on Phase 6 (DONE) of the Mission Protocol.

### M1 — User Profile Page (50 pts) · easy · /profile (new)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')` (per spec).

**Testid contract** (source: [1-easy.cy.js:8-42](../frontend/cypress/e2e/smoke/1-easy.cy.js#L8-L42)):
- `profile-nav-link` — clickable, navigates to `profile-page`
- `profile-page` — visible after click
- `profile-username`, `profile-email`, `profile-role`, `profile-created-at`, `profile-last-active` — visible, non-empty text
- `profile-edit-button` — click reveals `profile-save-button`
- `profile-save-button` — visible after edit
- `profile-password-current`, `profile-password-new`, `profile-password-confirm`, `profile-password-save` — exist

**Implementation notes** (filled on Phase 6):
- Files touched: —
- Foundations added/extended: —
- Backend models/routes added: —
- Deferred Cyclopt findings: —
- Time: —

### M2 — Dark Mode Toggle (50 pts) · easy · header (global)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`.

**Testid contract** (source: [1-easy.cy.js:47-65](../frontend/cypress/e2e/smoke/1-easy.cy.js#L47-L65)):
- `dark-mode-toggle` — exists in the header
- `theme-indicator-light` — visible by default
- `theme-indicator-dark` — visible after clicking `dark-mode-toggle`

**Implementation notes:** —

### M3 — Dashboard Bookmarks (60 pts) · easy · /dashboard, /dashboard1, /dashboard2

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()`; mission visits each dashboard route in turn.

**Testid contract** (source: [1-easy.cy.js:70-95](../frontend/cypress/e2e/smoke/1-easy.cy.js#L70-L95)):
- `bookmark-toggle-dashboard` — exists on `/dashboard`
- `bookmark-toggle-dashboard1` — exists on `/dashboard1`
- `bookmark-toggle-dashboard2` — exists on `/dashboard2`
- `bookmark-active-dashboard1` — visible after clicking `bookmark-toggle-dashboard1`

**Implementation notes:** —

### M4 — CSV Export for Charts (60 pts) · easy · /dashboard, /dashboard2

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()`; mission visits `/dashboard` and `/dashboard2`.

**Testid contract** (source: [1-easy.cy.js:100-124](../frontend/cypress/e2e/smoke/1-easy.cy.js#L100-L124)):
- At least one element with testid prefix `export-csv-` on `/dashboard`
- `export-csv-quarterly-sales` — exists on `/dashboard2`
- `export-csv-budget-vs-actual` — exists on `/dashboard2`
- `export-csv-performance` — exists on `/dashboard2`

**Implementation notes:** —

### M5 — Activity Log (80 pts) · easy · /activity (new)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`. Sidebar admin-only.

**Testid contract** (source: [1-easy.cy.js:129-157](../frontend/cypress/e2e/smoke/1-easy.cy.js#L129-L157)):
- `sidebar-activity-link` — visible for admin
- click → `activity-page` visible, `activity-table` visible
- `activity-filter-user`, `activity-filter-action`, `activity-filter-date-from`, `activity-filter-date-to` — exist
- `activity-pagination` — exists

**Implementation notes:** —

### M6 — Notification Center (50 pts) · easy · header (global)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`.

**Testid contract** (source: [1-easy.cy.js:162-184](../frontend/cypress/e2e/smoke/1-easy.cy.js#L162-L184)):
- `notification-bell` — exists in header
- click → `notification-dropdown` visible
- inside `notification-dropdown`: `notification-mark-all-read`, `notification-clear-all` — exist

**Implementation notes:** —

### M7 — Dashboard Filter Persistence (50 pts) · easy · /dashboard1

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard1')`.

**Testid contract** (source: [1-easy.cy.js:189-204](../frontend/cypress/e2e/smoke/1-easy.cy.js#L189-L204)):
- `filter-metric`, `filter-date-from`, `filter-date-to` — exist on `/dashboard1`
- `filter-reset-button` — exists on `/dashboard1`

**Production-scope note:** the cypress assertion only checks existence, but production scope dictates real persistence (localStorage hook). Use the "Filter persistence hook" foundation.

**Implementation notes:** —

### M8 — Breadcrumb Navigation (60 pts) · easy · global (authenticated)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard1')`.

**Testid contract** (source: [1-easy.cy.js:209-225](../frontend/cypress/e2e/smoke/1-easy.cy.js#L209-L225)):
- `breadcrumb-bar` — visible on an authenticated page
- inside `breadcrumb-bar`: `breadcrumb-home`, `breadcrumb-current` — exist

**Implementation notes:** —

### M9 — Sales Records CRUD (150 pts) · medium · /sales-data (new, inferred route)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`. Reached via sidebar.

**Testid contract** (source: [2-medium.cy.js:8-42](../frontend/cypress/e2e/smoke/2-medium.cy.js#L8-L42)):
- `sidebar-sales-data-link` — click → `sales-data-page` visible
- `sales-data-add-button` — exists on `sales-data-page`
- click `sales-data-add-button` → `sales-data-form` visible
- inside form: `sales-data-field-category`, `sales-data-field-month`, `sales-data-field-year`, `sales-data-field-value`, `sales-data-field-unit`, `sales-data-field-notes` — exist
- `sales-data-form-submit`, `sales-data-form-cancel` — exist

**Production-scope note:** requires Mongoose model (e.g. `SalesRecord`) + REST routes. No frontend mocks.

**Implementation notes:** —

### M10 — Threshold Alerts System (150 pts) · medium · /alerts (new, inferred route)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`.

**Testid contract** (source: [2-medium.cy.js:47-75](../frontend/cypress/e2e/smoke/2-medium.cy.js#L47-L75)):
- `sidebar-alerts-link` — click → `alerts-page` visible
- one of `alerts-empty` OR `alerts-table` — exists (empty state if no rules yet)
- `alerts-add-button` — click → `alerts-form` visible
- `alerts-field-metric`, `alerts-field-operator`, `alerts-field-threshold` — exist
- `alerts-form-submit`, `alerts-form-cancel` — exist

**Production-scope note:** requires `AlertRule` model + REST routes. Triggered alerts feed into the Notification store foundation.

**Implementation notes:** —

### M11 — In-App Notes & Annotations (120 pts) · medium · /dashboard1

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard1')`.

**Testid contract** (source: [2-medium.cy.js:80-102](../frontend/cypress/e2e/smoke/2-medium.cy.js#L80-L102)):
- `notes-toggle-button` — exists on `/dashboard1`
- click → `notes-panel` visible
- inside `notes-panel`: `notes-add-input`, `notes-add-submit` — exist

**Production-scope note:** requires `Note` model + REST routes (per-user notes).

**Implementation notes:** —

### M12 — Data Comparison Mode (150 pts) · medium · /dashboard1

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard1')`.

**Testid contract** (source: [2-medium.cy.js:107-127](../frontend/cypress/e2e/smoke/2-medium.cy.js#L107-L127)):
- `compare-toggle` — exists on `/dashboard1`
- click → `compare-panel-left`, `compare-panel-right` — visible
- `compare-close` — exists after activation

**Implementation notes:** —

### M13 — Multi-Language Support / i18n (120 pts) · medium · header (global)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`.

**Testid contract** (source: [2-medium.cy.js:132-153](../frontend/cypress/e2e/smoke/2-medium.cy.js#L132-L153)):
- `language-switcher` — exists in header
- click → `language-option-en`, `language-option-el` — visible
- `language-active` — visible, default text trimmed/uppercased equals `EN`

**Production-scope note:** real i18n provider (e.g. react-intl) with EN + EL translations applied to user-visible strings. No-op switcher is forbidden.

**Implementation notes:** —

### M14 — Map-Based Data Entry (180 pts) · medium · /map (new)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/map')`.

**Testid contract** (source: [2-medium.cy.js:158-184](../frontend/cypress/e2e/smoke/2-medium.cy.js#L158-L184)):
- `map-page` — exists
- at least one element with testid prefix `map-region-` — exists
- click first `map-region-*` → `map-data-form` visible
- `map-data-field-region-name`, `map-data-field-category`, `map-data-field-revenue` — exist
- `map-data-form-submit` — exists

**Production-scope note:** use `react-simple-maps` (already in deps) for the map; backend `MapDataEntry` model + REST routes for persistence.

**Implementation notes:** —

### M15 — Report Builder (180 pts) · medium · /reports (new, inferred route)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`.

**Testid contract** (source: [2-medium.cy.js:189-213](../frontend/cypress/e2e/smoke/2-medium.cy.js#L189-L213)):
- `sidebar-reports-link` — click → `reports-page` visible
- `reports-create-button` — exists on `reports-page`
- click → `report-wizard` visible
- `report-wizard-title`, `report-wizard-chart-select`, `report-wizard-save` — exist

**Production-scope note:** `Report` model + REST routes; saved reports list on `reports-page`.

**Implementation notes:** —

### M16 — Audit Trail (120 pts) · medium · /audit (new, inferred route)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`. Sidebar admin-only.

**Testid contract** (source: [2-medium.cy.js:218-240](../frontend/cypress/e2e/smoke/2-medium.cy.js#L218-L240)):
- `sidebar-audit-link` — visible for admin
- click → `audit-page` visible, `audit-table` visible
- `audit-filter-action`, `audit-filter-date-from`, `audit-filter-date-to` — exist

**Production-scope note:** can share the Activity/Audit logger foundation with M5 (one model + `kind` discriminator).

**Implementation notes:** —

### M17 — User Preferences & Settings (100 pts) · medium · /settings (new, inferred route)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`.

**Testid contract** (source: [2-medium.cy.js:245-268](../frontend/cypress/e2e/smoke/2-medium.cy.js#L245-L268)):
- `settings-nav-link` — click → `settings-page` visible
- `settings-page-size`, `settings-default-dashboard`, `settings-date-format`, `settings-sidebar-collapsed` — exist
- `settings-save-button` — exists

**Production-scope note:** `UserSettings` model (per-user) + REST routes; `settings-default-dashboard` ties to the ThemeProvider/i18n foundations on save.

**Implementation notes:** —

### M18 — Real-Time Collaborative Dashboard (250 pts) · hard · /dashboard

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`.

**Testid contract** (source: [3-hard.cy.js:8-26](../frontend/cypress/e2e/smoke/3-hard.cy.js#L8-L26)):
- `realtime-status` — exists on `/dashboard`
- `realtime-status-connected` — visible after page load
- `realtime-viewers`, `realtime-viewer-count` — exist

**Production-scope note:** real websocket connection (e.g. `ws` or `socket.io`) reporting connection state and connected viewer count. Fake "Connected" status is forbidden.

**Implementation notes:** —

### M19 — Advanced Search & Global Filter (200 pts) · hard · header (global)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`.

**Testid contract** (source: [3-hard.cy.js:31-51](../frontend/cypress/e2e/smoke/3-hard.cy.js#L31-L51)):
- `global-search-trigger` — exists in header
- click → `global-search-dialog` visible, `global-search-input` visible
- `global-search-close` — exists inside dialog

**Production-scope note:** dialog opens search across actual data (sales records, reports, users, etc.). Hardcoded result list is forbidden.

**Implementation notes:** —

### M20 — CSV/JSON Data Import (200 pts) · hard · /import (new, inferred route)

**Status:** TODO · last updated: —

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')`.

**Testid contract** (source: [3-hard.cy.js:56-77](../frontend/cypress/e2e/smoke/3-hard.cy.js#L56-L77)):
- `sidebar-import-link` — click → `import-page` visible
- `import-dropzone`, `import-file-input` — exist
- `import-commit-button` — exists

**Production-scope note:** `ImportJob` model + REST upload route, parses CSV/JSON, persists to relevant collections.

**Implementation notes:** —
````

- [ ] **Step 3: Verify the file was written and looks right**

Run: `wc -l /Users/oiiko96/walkauthon/sgarden/.claude/missions-inventory.md && head -40 /Users/oiiko96/walkauthon/sgarden/.claude/missions-inventory.md`

Expected: file is roughly 280–340 lines; header + summary table + foundations table render correctly. If the file is < 200 lines, content was truncated — re-write it.

---

## Task 3: Author `CLAUDE.md`

**Files:**
- Create: `sgarden/CLAUDE.md`

This is the auto-loaded entry point for Claude Code in this repo. Self-contained — no chained reads required to start work.

- [ ] **Step 1: Confirm config inputs are still accurate**

The file embeds verified facts from the codebase. Confirm none have drifted since brainstorming:

Run these in parallel:
- `grep -n "baseUrl" /Users/oiiko96/walkauthon/sgarden/frontend/cypress.config.js`
- `grep -n "port" /Users/oiiko96/walkauthon/sgarden/frontend/craco.config.cjs`
- `grep -n "PORT" /Users/oiiko96/walkauthon/sgarden/backend/server.js`
- `grep -n "password" /Users/oiiko96/walkauthon/sgarden/scripts/seed-test-users.js`

Expected:
- cypress baseUrl: `http://localhost:3002`
- craco devServer port: `3002`
- backend default PORT: `4000`
- seed users: `admin / admin123` and `user / user1234`

If any value differs → STOP and update the relevant lines in Step 2's content before writing.

- [ ] **Step 2: Write the complete CLAUDE.md**

Use the Write tool to create `/Users/oiiko96/walkauthon/sgarden/CLAUDE.md` with EXACTLY this content:

````markdown
# CLAUDE.md — SGarden Hackathon

> Auto-loaded by Claude Code. This file is hackathon-scoped and disposable post-event.
> Live mission state lives in `.claude/missions-inventory.md`.

## ⚠ ABSOLUTE RULES

1. **NEVER** run `git commit`, `git push`, `git add`, or any other git mutating command. The user commits manually at the end of the hackathon.
2. **NEVER** mark a mission DONE without observed GREEN smoke output AND a clean Cyclopt sast run on every modified file.
3. **NEVER** skip Phase 5 (Cyclopt) to "save time". Heavy gate is non-negotiable.
4. **NEVER** batch-implement multiple missions before running smoke per-mission.
5. **NEVER** add frontend mock data when backend persistence is testable. Production scope was chosen — no shortcuts.

---

## 1. Project Map

```
sgarden/
├── frontend/                          # React 18 + CRA + craco (ESLint disabled in dev)
│   ├── src/
│   │   ├── api/index.js               # ky-based HTTP client — extend here for new endpoints
│   │   ├── components/                # Shared UI primitives — REUSE before creating new
│   │   │   ├── Form.js, Table.js, Dialog.js, Snackbar.js, Buttons.js, Input.js
│   │   │   ├── Dropdown.js, RadioButtons.js, Switch.js, Slider.js, Checkbox.js
│   │   │   ├── Header.js, Sidebar.js, Footer.js, Card.js, Accordion.js, Popup.js
│   │   │   ├── Plot.js, Map.js, Spinner.js, Search.js, Tooltip.js, DatePicker.js
│   │   │   ├── ErrorFallback.js, AdminOnly.js, GuestOnly.js, Protected.js
│   │   ├── screens/                   # Route-level pages — add new pages here
│   │   │   ├── Dashboard.js, Dashboard1.js, Dashboard2.js
│   │   │   ├── Auth.js, SignIn.js, SignUp.js, ForgotPassword.js, ResetPassword.js
│   │   │   ├── InvitedSignUp.js, Users.js, NotFound.js
│   │   ├── utils/                     # dayjs.js, jwt.js, validations.js, cookie.js, constants.js, ...
│   │   ├── use-global-state.js        # zustand store — pattern for new stores (use-{name}-state.js)
│   │   ├── index.js                   # Routes + providers — REGISTER NEW ROUTES HERE
│   │   ├── _colors.scss, index.scss
│   ├── cypress/
│   │   ├── e2e/smoke/                 # ⚠ THE CONTRACT — do NOT modify
│   │   │   ├── 1-easy.cy.js           # M1–M8
│   │   │   ├── 2-medium.cy.js         # M9–M17
│   │   │   ├── 3-hard.cy.js           # M18–M20
│   │   ├── support/commands.js        # cy.loginAsAdmin() at line 25 — DO NOT redefine
│   │   ├── reporters/silent-reporter.js
│   ├── run-smoke-tests.js             # Wrapper runner (silent reporter, final summary)
│   ├── cypress.config.js              # baseUrl http://localhost:3002, env apiUrl http://localhost:4000/api
│   └── craco.config.cjs               # devServer.port = 3002, eslint.enable = false
├── backend/                           # Express 4 + Mongoose 6 (MongoDB)
│   ├── server.js                      # JWT, helmet, cors, listens on PORT || 4000
│   ├── src/
│   │   ├── models/                    # Mongoose schemas (index.js, user.js, invitation.js, reset.js)
│   │   ├── routes/                    # Express routers (index.js, data.js, info.js, public.js, user.js, user-system.js)
│   │   ├── middleware/index.js        # Auth + error handling
│   │   ├── utils/                     # attach-user.js, email.js, validation-schemas.js, validations.js, mongoose.js
│   ├── .env                           # Local — see .env.sample
├── scripts/
│   ├── run-smoke-with-services.mjs    # Boots backend + frontend, runs smoke, tears down
│   ├── seed-test-users.js             # Inserts admin + user accounts
│   ├── cypress.config.js
└── package.json                       # ⚠ ALL deps live here
```

## 2. Commands Cheatsheet

```sh
# Setup (once)
cd sgarden
npm install                            # installs everything from root

# Dev (interactive)
npm run dev                            # backend + frontend in parallel
npm run frontend:start                 # frontend only (port 3002)
npm run backend:dev                    # backend only (port 4000, nodemon)

# Smoke tests (the score)
npm run smoke:test:auto                # boots services + runs all smoke specs + report
npm run smoke:test                     # runs against ALREADY-RUNNING services
npm run smoke:seed                     # seed test users into DB

# Single mission run (TDD per-mission — preferred during Phase 2 + 4)
cd sgarden/frontend && \
  npx cypress run \
    --spec cypress/e2e/smoke/{tier}.cy.js \
    --grep "M{N}:"
# tier ∈ {1-easy, 2-medium, 3-hard}
# Live per-mission points printed via cypress.config.js after-spec hook.

# Lint
npm run lint                           # both frontend + backend
npm run frontend:lint
npm run backend:lint

# Build
npm run frontend:build
npm run start:all                      # production-style: backend + served build
```

## 3. Conventions & Quirks

**Critical:**

- `data-testid` is the contract — exact kebab-case. ANY typo = lost points.
- ⚠ Root `package.json` is the ONLY dep manifest. NEVER `npm install` inside `frontend/` or `backend/`.
- ⚠ ESLint config: `iamnapo` + `iamnapo/react`. Strict. Cyclopt + lint will both complain on style violations.
- ⚠ Frontend dev port is **3002** (craco overrides CRA default 3000). Cypress baseUrl: `http://localhost:3002`. Backend on **4000**.
- Cypress timeouts: defaultCommandTimeout 3000ms, requestTimeout 8000ms, pageLoadTimeout 20000ms — keep components fast.
- `cy.loginAsAdmin()` is provided by `cypress/support/commands.js:25` — DO NOT redefine.

**Frontend stack (use these — DO NOT introduce alternatives):**

- UI: `@mui/material` v5 + `@mui/icons-material` + `@emotion/{react,styled}`
- Date pickers: `@mui/x-date-pickers` + `dayjs` (configured in `utils/dayjs.js`)
- State (UI): `zustand` (see `use-global-state.js`)
- Server data: `swr`
- HTTP: `ky` (see `api/index.js`)
- Forms: `formik` + `yup`
- Routing: `react-router-dom` v6
- Charts: `react-plotly.js` (already wired in Dashboard1/Dashboard2)
- Maps: `react-simple-maps` (use for M14)
- Tables: `react-table-6` (legacy but installed)
- Errors: `react-error-boundary`

**Backend stack:**

- Framework: Express 4
- DB: Mongoose 6 (MongoDB)
- Auth: `jsonwebtoken` + `bcryptjs`, JWT in cookies (`js-cookie` on frontend)
- Validation: yup schemas in `utils/validation-schemas.js`
- Email: `@sendgrid/mail` (`utils/email.js`)
- Logging: `morgan`
- Security: `helmet`, `cors`

**Test users (after `npm run smoke:seed`) — ⚠ DELETE THIS BLOCK BEFORE COMMITTING:**

```
admin / admin123    role=admin   email=admin@sgarden.test
user  / user1234    role=user    email=user@sgarden.test
DATABASE_URL default: mongodb://localhost:27017/testDB
```

**Known honeypot:** `backend/server.js:19` has `const unusedVariable = "I am not used";` — likely intentional to test the analyzer. DO NOT touch unless Cyclopt flags it in a file you are modifying for a mission.

---

## 4. Mission Protocol — TDD-strict State Machine

**Trigger:** User says "next mission: M_X", "let's do M_X", or "M_X".

**Pre-flight:** Create a TodoWrite with 6 todos (one per phase). Mark `in_progress` on entry; mark `completed` only on phase exit.

### Phase 1 — BRIEF
- Read the mission's `describe` block in `frontend/cypress/e2e/smoke/{tier}.cy.js`.
- Extract the testid contract: every `[data-testid="..."]` selector + its assertion (exists | be.visible | text not empty | within block).
- Note the route(s) under test (`cy.visit(...)`).
- Update inventory: status `TODO → RED`.
- **HARD GATE:** Do not proceed without the testid contract written down (in TodoWrite or transcript). Phase 2 needs it.

### Phase 2 — RED (verify failing baseline)
- Ensure dev services are running. Ask the user if unsure (`npm run dev`, or `smoke:test:auto` auto-boots them).
- Run ONLY this mission's spec:
  ```sh
  cd sgarden/frontend && npx cypress run \
    --spec cypress/e2e/smoke/{tier}.cy.js \
    --grep "M{N}:"
  ```
- Confirm RED: at least one assertion fails for THIS mission. If GREEN already → mark `CYCLOPT-CLEAN` and skip to Phase 5.
- **HARD GATE:** Never proceed to Phase 3 without observed RED output for this mission's testids. RED gate is strict ALWAYS, even if mission obviously absent.

### Phase 3 — IMPLEMENT (production scope)

Six moves, in order:

1. **Survey first (read-only).** Read/Grep before writing. Check existing routes (`frontend/src/index.js`), existing components, whether testids already exist.

2. **Foundation first.** If a foundation is shared by >1 mission, build it BEFORE the consumer. See `.claude/missions-inventory.md` Foundations table.

3. **Frontend wiring.**
   - New page → `frontend/src/screens/{Name}.js`
   - Register route → `frontend/src/index.js`
   - Reusable bits → `frontend/src/components/`
   - HTTP → extend `frontend/src/api/index.js` (uses `ky`)
   - UI state → zustand store side-by-side with `use-global-state.js`
   - Server state → `swr`
   - Dates → `dayjs` via `utils/dayjs.js`
   - Stack consistency: MUI v5 + emotion. DO NOT introduce alternative UI libraries.

4. **Backend wiring (when persistence is testable).**
   - Mongoose model → `backend/src/models/{name}.js`, register in `models/index.js`
   - Express route → `backend/src/routes/{name}.js`, register in `routes/index.js`
   - Auth middleware → already exists (`backend/src/middleware/index.js`, `utils/attach-user.js`)
   - Validation → extend `backend/src/utils/validation-schemas.js`

5. **Wire real functionality, not shells.**
   - M2 dark mode → MUI theme palette switch (not just a toggle).
   - M4 CSV export → real blob + download trigger (not `console.log`).
   - M3 bookmarks → persist (localStorage or UserSettings backend).
   - M18 realtime → real websocket (not fake "Connected" status).
   - **⚠ EXPLICIT BAN: Frontend mock data is FORBIDDEN when backend persistence is testable.**

6. **Testid precision (final touch).**
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
  - `mcp__cyclopt__analyze_sast(file_path)`
  - `mcp__cyclopt__analyze_violations(file_path)`
- (DO NOT run `analyze_metrics` per-mission — that is a final-sweep tool.)
- Triage by severity (see Section 5 below).
- Re-run after fixes. **Max 2 retries; on 3rd loop, STOP and ask the user.**
- If a fix changes behavior → loop back to Phase 4 before exiting Phase 5.
- Update inventory: status `GREEN → CYCLOPT-CLEAN`.
- **HARD GATE:** Never transition to `CYCLOPT-CLEAN` with any unresolved critical or high finding.

### Phase 6 — DONE
- Update inventory: status `CYCLOPT-CLEAN → DONE`, add timestamp + notes (files touched, foundations added, deferred-finding count).
- Recompute totals (`{N} DONE`, `{X} / 2380 pts`).
- Report to user: 1-line summary, points earned, deferred-finding count.
- ⚠ **DO NOT commit.** Wait for the user's explicit instruction.
- Wait for the user to say "next: M_Y" before starting another mission.

---

## 5. Cyclopt Gate — Severity Decision Tree

| Severity   | Action                                                                                  |
|------------|-----------------------------------------------------------------------------------------|
| CRITICAL   | MUST FIX NOW. No exceptions. Re-run Phase 4 if behavior changed.                        |
| HIGH       | MUST FIX NOW. No exceptions. Same re-run rule.                                          |
| MEDIUM     | Append to `.claude/cyclopt-followups.md`. DO NOT fix mid-mission unless trivial (1-line, no behavior risk). |
| LOW        | Append to `.claude/cyclopt-followups.md`. NEVER fix mid-mission.                        |
| INFO       | Ignore. Do not log.                                                                      |

**False positives:** Still log them with explicit "deferred-critical-needs-review" status and ask the user to confirm before proceeding past the gate.

**Cannot-fix scenarios:** If a critical/high finding cannot be fixed without breaking the cypress contract — STOP and ask the user. Mark mission `BLOCKED` in inventory with reason.

**Followup log template** (`.claude/cyclopt-followups.md` is created lazily on the first deferred medium/low finding):

```markdown
## M{N} — {mission title} — {YYYY-MM-DD HH:MM}

- **File**: `path/to/file.js`
- **Severity**: medium | low | (deferred-critical-needs-review)
- **Rule**: {cyclopt rule id}
- **Summary**: {one line}
- **Decision**: defer | accept-as-is | needs-user-input
- **Reason**: {why deferred}
```

---

## 6. Inventory Update Protocol

`.claude/missions-inventory.md` is the live source of truth. Mutate it at every Phase transition:

| Phase exit | Mutation                                                                          |
|------------|-----------------------------------------------------------------------------------|
| Phase 1    | Status `TODO → RED` in summary table; expand per-mission detail if needed         |
| Phase 4    | Status `RED → GREEN`                                                              |
| Phase 5    | Status `GREEN → CYCLOPT-CLEAN`                                                    |
| Phase 6    | Status `CYCLOPT-CLEAN → DONE`; fill implementation notes; recompute totals row    |
| BLOCKED    | Only when STOP+ask user; include reason in Notes column                           |

Foundations table mutates the same way when you build a foundation; record files added under the Files column.

---

## 7. Ordering Strategy — Greedy ROI

Default order (user can override at any time with "next: M_X"):

1. **Easy tier (M1–M8):** quick wins, low risk. ≈ 460 pts.
2. **Medium tier (M9–M17), easier-first sub-order:**
   - First: M11 (notes, light backend), M13 (i18n, mostly frontend), M16 (audit, similar to M5), M17 (settings, simple form)
   - Then: M9 (sales CRUD), M10 (alerts), M14 (map + form), M15 (report builder)
3. **Hard tier (M18–M20):** M19 (search dialog) → M20 (import) → **M18 LAST** (websocket riskiest).

---

## 8. Red Flags / Rationalizations

If you catch yourself thinking any of the following, STOP and follow the second column.

| Thought                                        | Reality                                                                |
|------------------------------------------------|------------------------------------------------------------------------|
| "It's just a small Cyclopt finding"            | Heavy gate. Fix it (if critical/high) or log it (if medium/low).       |
| "Tests pass, I'll skip Cyclopt this once"      | Phase 5 is mandatory. Run it.                                           |
| "Let me commit this real quick"                | NEVER. The user commits at the end.                                     |
| "I'll mock data on the frontend, faster"       | Production scope. Backend if testable.                                  |
| "I'll batch M1, M2, M3 then run smoke"         | One mission at a time. Smoke per mission.                               |
| "RED gate is silly, the mission obviously isn't done" | Strict always. Run it.                                          |
| "False positive, I'll just skip"               | Log it as deferred-critical, ask the user.                              |
| "I'll skip survey, I know what to write"       | Always survey first. Foundations might already exist.                   |
| "I'll re-run Cyclopt 3 more times until clean" | Max 2 retries. On the 3rd loop, STOP and ask the user.                  |

---

## 9. Hackathon Constraints (Bookmark)

Repeat of the absolute rules — second-pass reminder before you act.

- NEVER `git commit`, `git push`, `git add` autonomously. The user does git.
- NEVER skip Phase 5 (Cyclopt). Heavy gate is non-negotiable.
- NEVER frontend-mock data when backend persistence is testable.
- NEVER batch-implement multiple missions before running smoke per-mission.
- Default order: easy → medium-light → medium-heavy → hard → M18 last. User can override.
````

- [ ] **Step 3: Verify the file was written**

Run: `wc -l /Users/oiiko96/walkauthon/sgarden/CLAUDE.md && head -20 /Users/oiiko96/walkauthon/sgarden/CLAUDE.md`

Expected: roughly 250–290 lines; absolute rules visible at top. If under 200 lines, content was truncated — re-write it.

---

## Task 4: Verification pass

Three independent verifications: testid spot-check, config-fact verify, and a readability sanity check.

- [ ] **Step 1: Testid spot-check — every testid in the inventory must exist literally in a cypress spec**

Run this script (it counts testids referenced in the inventory and verifies each appears in the cypress smoke specs):

```sh
cd /Users/oiiko96/walkauthon/sgarden
# Extract testid strings from the inventory (anything in single backticks that looks like kebab-case)
grep -oE '`[a-z][a-z0-9-]*[a-z0-9]`' .claude/missions-inventory.md \
  | sort -u \
  | sed 's/`//g' \
  | while read tid; do
      if ! grep -q "data-testid=\"$tid\"" frontend/cypress/e2e/smoke/*.cy.js 2>/dev/null \
        && ! grep -q "data-testid\\^=\\\"$tid\\\"" frontend/cypress/e2e/smoke/*.cy.js 2>/dev/null; then
          # Some testids are prefixes (e.g. export-csv-, map-region-) referenced via attribute-starts-with
          if [[ "$tid" =~ -$ ]] || [[ "$tid" =~ ^(export-csv|map-region|bookmark-toggle|bookmark-active)$ ]]; then
            echo "PREFIX OK: $tid"
          else
            echo "MISSING IN CYPRESS: $tid"
          fi
      fi
    done
```

Expected: only `PREFIX OK:` lines (for prefix-style testids like `export-csv-` and `map-region-`) or no output at all. Any `MISSING IN CYPRESS:` line is a typo in the inventory — fix immediately.

- [ ] **Step 2: Config-fact verify — every embedded value in `CLAUDE.md` matches the live codebase**

Run in parallel:
- `grep -E "localhost:3002|localhost:4000|admin123|user1234|port = 3002" /Users/oiiko96/walkauthon/sgarden/CLAUDE.md`
- `grep -E "baseUrl|apiUrl" /Users/oiiko96/walkauthon/sgarden/frontend/cypress.config.js`
- `grep -E "port" /Users/oiiko96/walkauthon/sgarden/frontend/craco.config.cjs`
- `grep -nE "(admin123|user1234|PORT \\|\\| 4000)" /Users/oiiko96/walkauthon/sgarden/scripts/seed-test-users.js /Users/oiiko96/walkauthon/sgarden/backend/server.js`

Expected: ports `3002`, `4000`, baseUrl `http://localhost:3002`, apiUrl `http://localhost:4000/api`, creds `admin123` / `user1234` all match across both the CLAUDE.md and the source files. Any mismatch → fix the relevant line in CLAUDE.md.

- [ ] **Step 3: Inventory totals — sum the Pts column matches "2380"**

Run:
```sh
grep -E "^\| M[0-9]+ " /Users/oiiko96/walkauthon/sgarden/.claude/missions-inventory.md \
  | awk -F'|' '{gsub(/ /, "", $4); sum += $4} END {print "Sum =", sum}'
```

Expected: `Sum = 2380`. If different, you have a typo in a Pts cell — fix it AND update the totals line in the inventory.

- [ ] **Step 4: Readability sanity check — read both files end-to-end**

Use the Read tool on both files in full:
- `/Users/oiiko96/walkauthon/sgarden/CLAUDE.md`
- `/Users/oiiko96/walkauthon/sgarden/.claude/missions-inventory.md`

Confirm:
- No half-finished sections, no `TBD` / `FIXME` / `???` markers.
- Markdown tables render (pipes line up, separators present).
- Internal cross-references (e.g. CLAUDE.md → `.claude/missions-inventory.md`) point to files that now exist.
- The 5 absolute rules at the top of CLAUDE.md exactly match the 5 entries in the bookmark section at the bottom.

If any issue → fix inline with the Edit tool.

- [ ] **Step 5: Final report to user**

Write a 3–5 line summary to the user:
- Files created (paths, line counts).
- Total points indexed (2380 across 20 missions).
- Foundations registered (count: 8).
- Reminder: NO git commit was executed; the user controls all git operations.

---

## Self-Review Done During Authoring

The plan was checked against the spec on completion:

1. **Spec coverage:** Every spec section has at least one task —
   - Spec §3 (file architecture) → Task 1 + creation in Tasks 2/3
   - Spec §5 (project orientation content) → Task 3 (CLAUDE.md sections 1–3)
   - Spec §6 (Mission Protocol) → Task 3 (CLAUDE.md section 4)
   - Spec §7 (Cyclopt gate) → Task 3 (CLAUDE.md section 5)
   - Spec §8 (inventory format) → Task 2
   - Spec §9 (ordering) → Task 3 (CLAUDE.md section 7)
   - Spec §10 (red flags) → Task 3 (CLAUDE.md section 8)
   - Spec §11 (bookmark) → Task 3 (CLAUDE.md section 9)
   - Spec §12 (impl plan steps) → matches Tasks 1–4
   - Cyclopt-followups.md is intentionally NOT pre-created (per spec — lazy creation by protocol).

2. **Placeholder scan:** No "TBD"/"TODO"/"implement later"/"add validation"/"similar to Task N" markers in the plan content. The inventory's per-mission "Implementation notes" sections legitimately use `—` as filled-on-Phase-6 placeholders, which is by design (noted in the inventory header).

3. **Type/name consistency:** Status values (`TODO`/`RED`/`GREEN`/`CYCLOPT-CLEAN`/`DONE`/`BLOCKED`), file paths (`.claude/missions-inventory.md`, `.claude/cyclopt-followups.md`), and testid strings are spelled identically across the spec, the inventory, and CLAUDE.md.

4. **No git operations:** No `git add`, `git commit`, or `git push` appears anywhere in this plan. The user retains exclusive control of git.
