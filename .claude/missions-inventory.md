# SGarden Missions Inventory

> Live state for the SGarden hackathon. Updated at every Phase transition by the Mission Protocol in `CLAUDE.md`.
> Status legend: **TODO** · **RED** · **GREEN** · **CYCLOPT-CLEAN** · **DONE** · **BLOCKED**

**Last updated:** 2026-04-25 13:13 (after parallel medium-tier batch — M9–M17 DONE, 29/29 cypress, 1270 pts)

**Environment notes:**
- Cypress 13.17.0 was upgraded to 14.5.4 (`package.json`) because the 13.x Electron launcher misbehaves on this macOS (Darwin 25). Root cause is actually `ELECTRON_RUN_AS_NODE=1` set by VS Code shell — every cypress invocation must use `env -u ELECTRON_RUN_AS_NODE npx cypress run …` (or unset the var).
- Phase 2 RED gate skipped session-wide per user instruction (time-pressure mode).

## Summary

| ID  | Title                              | Tier   | Pts | Route(s)                         | Status | Notes |
|-----|------------------------------------|--------|-----|----------------------------------|--------|-------|
| M1  | User Profile Page                  | easy   | 50  | /profile (new)                   | DONE   | 4/4 cypress, SAST 0, violations 0/0/0 (19 deferred-FP) |
| M2  | Dark Mode Toggle                   | easy   | 50  | header (global)                  | DONE   | 3/3 cypress; zustand use-theme-state + buildTheme(mode); SAST 0, violations 0/0/0 |
| M3  | Dashboard Bookmarks                | easy   | 60  | /dashboard, /dashboard1, /dashboard2 | DONE | 4/4 cypress; zustand use-bookmarks-state (persist); SAST 0, violations 0/0/0 (76 deferred-FP cluster) |
| M4  | CSV Export for Charts              | easy   | 60  | /dashboard, /dashboard2          | DONE   | 4/4 cypress; utils/csv-export.js Blob+download; SAST 0, violations 0/0/0 |
| M5  | Activity Log                       | easy   | 80  | /activity (new)                  | DONE   | 4/4 cypress; Mongoose Activity model + GET /api/activity (admin, paginated, lazy-seed); SAST 0, violations 0/0/0 (5 deferred-FP) |
| M6  | Notification Center                | easy   | 50  | header (global)                  | DONE   | 3/3 cypress; zustand use-notification-state + Popover; SAST 0, violations 0/0/0 |
| M7  | Dashboard Filter Persistence       | easy   | 50  | /dashboard1                      | DONE   | 2/2 cypress; use-filter-persistence localStorage hook; SAST 0, violations 0/0/0. Hot-fix: DatePicker `slotProps`→`renderInput` for x-date-pickers v5 |
| M8  | Breadcrumb Navigation              | easy   | 60  | global (authenticated)           | DONE   | 2/2 cypress; breadcrumb-bar testid on Paper + Home prepend + last crumb Typography; SAST 0, violations 0/0/0 |
| M9  | Sales Records CRUD                 | medium | 150 | /sales-data (new)                | DONE   | 4/4 cypress (final merge run); SalesRecord model + REST CRUD + SalesData screen; SAST 0, violations 0/0/0 (2 deferred-FP `_req`) |
| M10 | Threshold Alerts System            | medium | 150 | /alerts (new)                    | DONE   | 3/3 cypress; AlertRule model + REST + Alerts screen; wires `useNotificationState.addNotification` on submit (M10↔M6); SAST 0, violations 0/0/0 (2 deferred-FP) |
| M11 | In-App Notes & Annotations         | medium | 120 | /dashboard1                      | DONE   | 3/3 cypress; Note model + REST (per-user, owner-scoped delete); Drawer in Dashboard1; SWR; SAST 0, violations 0/0/0 |
| M12 | Data Comparison Mode               | medium | 150 | /dashboard1                      | DONE   | 3/3 cypress; pure frontend; halfIndex split of existing Dashboard1 chart data into previous/current period panels; SAST 0, violations 0/0/0 |
| M13 | Multi-Language Support / i18n      | medium | 120 | header (global)                  | DONE   | 3/3 cypress; foundation built (use-i18n-state.js + utils/i18n.js with en/el dicts); LanguageIcon Menu in Header; SAST 0, violations 0/0/0 |
| M14 | Map-Based Data Entry               | medium | 180 | /map (route swapped)             | DONE   | 4/4 cypress; MapDataEntry model + REST + MapDataEntry screen w/ 5-region grid; /map route swapped from Map.js to MapDataEntry; SAST 0, violations 0/0/0 (2 deferred-FP) |
| M15 | Report Builder                     | medium | 180 | /reports (new)                   | DONE   | 3/3 cypress; Report model + REST + Reports screen w/ collapsible wizard; SAST 0, violations 0/0/0 (2 deferred-FP) |
| M16 | Audit Trail                        | medium | 120 | /audit (new, admin-only)         | DONE   | 3/3 cypress; REUSES existing M5 Activity model + GET /api/activity (no new model, no backend patch); new Audit screen only; SAST 0, violations 0/0/0 |
| M17 | User Preferences & Settings        | medium | 100 | /settings (new)                  | DONE   | 3/3 cypress; UserSettings model + GET/PUT /api/user-settings/me + Settings screen; settings-nav-link in Header (not Sidebar); SAST 0, violations 0/0/0 (2 deferred-FP) |
| M18 | Real-Time Collaborative Dashboard  | hard   | 250 | /dashboard                       | TODO   |       |
| M19 | Advanced Search & Global Filter    | hard   | 200 | header (global)                  | TODO   |       |
| M20 | CSV/JSON Data Import               | hard   | 200 | /import (new, inferred)          | TODO   |       |

**Totals:** 20 missions · 17 DONE · 1730 / 2380 pts earned (72.7%)
(easy 460 ✅ + medium 1270 ✅ + hard 650)

## Foundations (cross-cutting infrastructure)

Build BEFORE the consumer mission. Each foundation gets its own row; status mirrors mission states.

| Foundation                              | Used by                              | Status | Files                              |
|-----------------------------------------|--------------------------------------|--------|------------------------------------|
| ThemeProvider (light/dark, MUI palette) | M2, M17                              | DONE   | frontend/src/use-theme-state.js, frontend/src/index.js (buildTheme) |
| i18n provider + EN/EL translations      | M13, M17                             | DONE   | frontend/src/use-i18n-state.js, frontend/src/utils/i18n.js |
| Sidebar items registry                  | M5, M9, M10, M15, M16, M20           | PARTIAL| Inline-Button pattern repeated 5× (activity-admin, sales-data, alerts, reports, audit-admin). No abstraction; fine for hackathon scope. |
| Notification store (zustand)            | M6, M10                              | DONE   | frontend/src/use-notification-state.js (persist), Header Popover |
| Activity/Audit logger (backend + UI)    | M5, M16                              | DONE   | backend/src/models/activity.js, backend/src/routes/activity.js, frontend/src/screens/Activity.js |
| Bookmarks store (localStorage or DB)    | M3                                   | DONE   | frontend/src/use-bookmarks-state.js (persist) |
| Filter persistence hook (localStorage)  | M7                                   | DONE   | frontend/src/use-filter-persistence.js |
| Realtime client (websocket)             | M18                                  | TODO   |                                    |

---

## Per-Mission Detail

Each section is expanded on Phase 1 (BRIEF) and finalised on Phase 6 (DONE) of the Mission Protocol.

### M1 — User Profile Page (50 pts) · easy · /profile (new)

**Status:** DONE · last updated: 2026-04-25 12:14

**Auth setup:** `cy.loginAsAdmin()` then `cy.visit('/dashboard')` (per spec).

**Testid contract** (source: [1-easy.cy.js:8-42](../frontend/cypress/e2e/smoke/1-easy.cy.js#L8-L42)):
- `profile-nav-link` — clickable, navigates to `profile-page`
- `profile-page` — visible after click
- `profile-username`, `profile-email`, `profile-role`, `profile-created-at`, `profile-last-active` — visible, non-empty text
- `profile-edit-button` — click reveals `profile-save-button`
- `profile-save-button` — visible after edit
- `profile-password-current`, `profile-password-new`, `profile-password-confirm`, `profile-password-save` — exist

**Implementation notes:**
- Cypress: 4/4 tests pass, 50/50 pts.
- Files touched:
  - `backend/src/routes/user.js` — added `GET /me`, `PUT /me`, `POST /change-password` (above the pre-existing `/decode/`).
  - `frontend/src/api/index.js` — added `getMyProfile`, `updateMyProfile`, `changePassword`.
  - `frontend/src/screens/Profile.js` — NEW screen with all 12 required testids, MUI v5, plain `Button`/`TextField` so `data-testid` propagates correctly.
  - `frontend/src/index.js` — registered `<Route path="profile" element={<Protected c={<Profile />} />} />`.
  - `frontend/src/components/Header.js` — added always-visible `profile-nav-link` Button (no responsive gating, sits before the existing md+ button row).
- Foundations added/extended: none yet (could later be the seed of a "user-self-service" group).
- Backend models/routes added: 3 routes on existing `User` model (no schema change, no new model).
- Cyclopt: SAST 0 vulnerabilities; violations 0/0/0 across Code Smell/Vulnerability/Bug. 19 `ESLINT_no-unused-vars` findings, all deferred-FP from inline-truncated submission (logged in [`cyclopt-followups.md`](cyclopt-followups.md#m1--user-profile-page--2026-04-25-1214)).
- Time: ~45 min (≈ 25 min of which were Cypress-binary troubleshooting before discovering `ELECTRON_RUN_AS_NODE=1`).

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
