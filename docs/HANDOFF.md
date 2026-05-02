# Pulse — Codex Handoff

Last updated: 2026-05-02

## Project Snapshot

Pulse is a real-time song bracket battle game. Two players each pick 8 Deezer songs, the server builds a 16-song single-elimination bracket, and a judge listens to previews and advances winners live over Socket.IO.

Current stack:

- Client: React, TypeScript, Vite, Tailwind v4, Zustand, Socket.IO client
- Server: Node, Express, TypeScript, Socket.IO, Prisma, Zod, PostgreSQL
- Music provider: Deezer search/previews through provider-agnostic `/api/search`

Core architecture decisions:

- Server-authoritative game state.
- Bracket stored as a 31-slot JSON array: champion at index `0`, leaves at `15-30`, children at `2i+1` / `2i+2`.
- Short-lived JWT room sessions, no real accounts.
- Socket.IO rooms are the live sync mechanism.
- Theme Mode is intentionally deferred until after the Lobby UI/UX overhaul.

## Current Branch State

Current branch: `dev`

Latest local commit:

- `47ae6b0 Fixed change role bug`

`dev` currently includes these recently merged squash PRs:

- `feat/reconnection-sync`
- `feat/bracket-visual-polish`
- `chore/centralize-errors`

Deployment bug-fix work is in progress on this branch.

## Recent Work Completed

### Reconnection / Presence

- Added connected/last-seen style presence handling.
- Added soft-disconnect UI behavior.
- Added early end-game path for non-spectators when someone disconnects.
- Added postgame route/view for champion or early-ended games.

### Bracket Visual Polish

- Added bracket header, progress indicator, player chips, round lanes, champion/postgame UI, waveform/audio polish.
- Removed stale `BracketTest` from the app build path.
- Added play overlays to picking `SongCard` and `SearchResult`.
- Add button in search results now changes to a checkmark for already-selected songs.

### Centralized User-Facing Errors

- REST API failures now throw readable messages from server responses.
- Toast system supports shared `addError(...)`.
- Socket errors, connection failures, bracket load failures, search failures, lock-in failures, and audio preview failures surface through toasts.

### Realtime Trust Boundaries

Implemented on current `refactor/trust-boundaries` branch:

- Sockets verify JWTs on `joinRoom`.
- Socket payloads are Zod-validated at the event boundary.
- Server stores canonical session data on `socket.data.session`.
- Server no longer trusts client-sent `userId`, `name`, `role`, or `code` after join.
- `pickUpdate`, `judgePick`, and `endGame` authorize from server-side session/DB state.

Verification run for this branch:

- `server`: `npm run test:run` passes
- `server`: `npx tsc --noEmit` passes
- `client`: `npm run build` passes
- `client`: `npm run lint` has 0 errors and 1 existing hook dependency warning in `PickingFilterPage.tsx`

### Production Runtime Prep

Implemented on current `chore/prod-prep` branch:

- Removed stale required Spotify env vars from runtime config.
- Added `ALLOWED_ORIGINS` parsing for production CORS.
- Applied Express `cors()` before API routes.
- Configured Socket.IO with the same allowed origin list.
- Added client `VITE_API_URL` and `VITE_SOCKET_URL` support.
- Added server production build/start/migration scripts.
- Added `GET /api/rooms/:code/state` for server-backed refresh recovery.
- Protected `GET /api/rooms/:code/bracket` with JWT auth.
- Added stale room policy: incomplete rooms expire after 24 hours, completed rooms after 7 days.
- Added manual expired-room cleanup command.
- Added `.env.example` files, `README.md`, and `DECISIONS.md`.

Verification run for this branch:

- `server`: `npm run build` passes
- `server`: `npm run test:run` passes
- `server`: `npx tsc --noEmit` passes
- `client`: `npm run lint` passes
- `client`: `npm run build` passes

### Deployment Test Bug Fixes

Implemented on current `dev` branch:

- Added Vercel SPA rewrite config so direct refreshes on `/play` and `/lobby/...` serve `index.html`.
- Adjusted room recovery routing so completed rooms can remain on either bracket or postgame.
- Added intentional-disconnect handling so Leave / Back to Home do not show false connection-loss and reconnection toasts.
- Wired lobby Leave button to clear local session and return home.
- Wired lobby Settings button to an informational toast until real settings exist.
- Extracted shared preview album art UI and reused it on matchup cards, bracket champion card, and postgame champion card.
- Added a champion-crowned state to the bracket header.
- Updated socket session role after `changeRole` so later player/judge authorization uses the new role.

Verification run for this branch:

- `client`: `npm run lint` passes
- `client`: `npm run build` passes
- `server`: `npm run build` passes
- `server`: `npm run test:run` passes
- `server`: `npx tsc --noEmit` passes

## Key Files

Start here for most tasks:

- `AGENTS.md` — working style and project rules
- `DECISIONS.md` — engineering journal
- `server/src/sockets/roomEvents.ts` — live room events and socket authorization
- `server/src/services/roomService.ts` — room creation, joining, picking, submission flow
- `server/src/services/bracketService.ts` — bracket generation and judging state machine
- `server/prisma/schema.prisma` — database models
- `client/src/App.tsx` — app routes and global socket listeners
- `client/src/components/lobby/Lobby.tsx` — current lobby screen
- `client/src/components/picking/PlayerSongSelect.tsx` — player picking flow
- `client/src/components/bracket/BracketView.tsx` — bracket page and judge interactions
- `client/src/stores/*` — Zustand state and persistence

## Known Issues / Launch Gaps

Highest priority before real-user deploy:

- Deploy latest `dev` / merged branch to Railway and Vercel.
- Complete hosted E2E bug-regression pass from lobby through postgame.
- Add deeper socket/service tests for authorization and room flow.

Important reliability work:

- Improve loading/empty states for search, bracket, and waiting screens.
- Avoid repeated toast spam from one failing audio preview.
- Automate expired room cleanup after manual cleanup proves sufficient.

Deferred intentionally:

- Theme Mode, until Lobby UI/UX overhaul.
- Reactions/chat.
- Shareable bracket image.
- Spotify playlist export.
- Multi-judge/audience voting.
- Synchronized playback for all users.

## Useful Commands

From `client/`:

```bash
npm run build
npm run lint
```

From `server/`:

```bash
npm run build
npm run test:run
npx tsc --noEmit
npm run migrate:deploy
npm run cleanup:rooms
```

GitHub PR flow used recently:

```bash
gh pr create --base dev --head <branch-name>
gh pr merge <number> --squash --delete-branch
```

## How To Start A New Codex Session

Recommended kickoff prompt:

```text
Read AGENTS.md, DECISIONS.md, and HANDOFF.md first. Then inspect only the files relevant to my request. Current goal: <one sentence>. Do not assume old design-doc details are still current.
```

For implementation tasks, include:

```text
Use the current branch state from HANDOFF.md. Before editing, check git status and inspect the relevant files. After editing, run the smallest meaningful verification.
```

For planning/research tasks, include:

```text
Stay read-only. Use HANDOFF.md for current state, Notion for larger product context, and the repo for source of truth.
```

## Maintenance Rule

After any meaningful branch/PR/feature work, update this file with:

- current branch and merge status
- what changed
- verification results
- next recommended task
