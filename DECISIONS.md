# Pulse — Engineering Decisions & Progress Log

This file is a running journal of every technical decision, tradeoff, and lesson learned while building Pulse. It's updated after each feature branch merge via the Post-Merge Debrief process defined in CLAUDE.md.

**Purpose:** Interview preparation material + architecture context for future sessions.

---

## Phase 1: Hello World — Express + Vite Dev Setup
**Completed:** Early March 2026

### What Was Built
Barebones Express server with a health check endpoint (`GET /api/health`), React client via Vite with TypeScript template, and a Vite dev proxy so the client can call `/api/*` without CORS issues in development.

### Key Decisions
- *Vite proxy over CORS middleware for dev:* Configuring `server.proxy` in `vite.config.ts` forwards API requests from the client dev server to Express, avoiding CORS headers entirely during development. Simpler and avoids a common source of bugs.
- *Separate client/ and server/ directories (monorepo):* Keeps concerns cleanly separated while allowing a single git repo. Each has its own `package.json` and TypeScript config.

### Lessons
- (To be filled in during a retroactive debrief if desired)

---

## Phase 2: Database — Prisma Schema + First Migration
**Completed:** Early March 2026

### What Was Built
Full Prisma schema with Room, Player, Song, and Bracket models. First migration run against local PostgreSQL. Verified with Prisma Studio.

### Key Decisions
- *Bracket state as JSON column:* The bracket is a binary tree. Normalizing it into relational tables (one row per matchup slot with foreign keys) would require 31 rows per bracket and complex joins to reconstruct the tree. A single JSON column holding a 31-slot flat array is read/written as one unit. Children of node `i` at `2i+1` and `2i+2`.
- *cuid() for IDs:* Collision-resistant, URL-safe, sortable by creation time. Better than auto-increment (exposes count) or UUID (longer, not sortable).
- *6-character room codes:* Short enough to say out loud at a party. Uniqueness enforced by `@unique` constraint — if a collision occurs on generation, retry.

### Lessons
- (To be filled in during a retroactive debrief if desired)

---

## Phase 3: Room System — Create & Join
**Completed:** Mid March 2026

### What Was Built
REST endpoints for room creation (`POST /api/rooms`) and joining (`POST /api/rooms/:code/join`). Role assignment by join order (first two = players, third = judge, rest = spectators). JWT session tokens. Landing page and basic lobby UI.

### Key Decisions
- *JWT over sessions for identity:* A party game doesn't need persistent accounts. A JWT containing `playerId` and `roomCode` is issued on join, stored in `sessionStorage`, and sent with subsequent requests. Stateless on the server.
- *Role assignment by join order:* Simplest approach for a party game. First two joiners are players, third is judge. No role selection UI needed for MVP.
- *Service layer pattern:* Route handlers are thin (validate → call service → respond). Business logic in `roomService.ts`. This keeps routes testable and logic reusable.

### Lessons
- (To be filled in during a retroactive debrief if desired)

---

## Phase 4: WebSocket Layer — Real-Time Room Updates
**Completed:** Mid March 2026

### What Was Built
Socket.IO integration alongside Express (shared HTTP server). Socket room joining (`join_room` event), `room_state` emission on connect, `player_joined` broadcasts. Lobby UI updates in real time when a second player joins.

### Key Decisions
- *Socket.IO over raw WebSockets:* Socket.IO provides automatic reconnection, room abstraction, and fallback to long-polling. The room system (`socket.join(room:${code})`) maps directly to our game room concept.
- *Socket rooms named `room:{code}`:* Namespaced to avoid collisions. All clients in a game room receive broadcasts without the server tracking individual socket IDs.

### Lessons
- (To be filled in during a retroactive debrief if desired)

---

## Phase 5: Deezer Search Proxy
**Completed:** March 2026

### What Was Built
Server-side proxy for Deezer's search API (`GET /api/search?q=...`). Client search component with 300ms debounce. Results show album art, title, artist, with null preview URLs filtered out server-side.

### Key Decisions
- *Deezer over Spotify:* Spotify deprecated `preview_url` for dev-mode apps in Nov 2024. Deezer requires zero authentication for search, returns working 30-second preview URLs, and has good search quality.
- *Provider-agnostic endpoint (`/api/search` not `/api/deezer/search`):* If we switch music providers later, the client doesn't change. Only the server-side service swaps.
- *Server-side filtering of null preview URLs:* The client never sees songs it can't play. Keeps the UI simple — no "preview unavailable" states to handle.
- *300ms debounce on search input:* Standard UX pattern. Prevents hammering the API on every keystroke while feeling responsive.

### Lessons
- (To be filled in during a retroactive debrief if desired)

---

<!-- New entries are appended here after each Post-Merge Debrief -->
