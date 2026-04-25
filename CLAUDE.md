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
