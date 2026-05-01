# Pulse — CLAUDE.md

## About Me

I'm Jackson, a CS grad building Pulse as my portfolio project for entry-level full-stack roles. Strongest on concepts, weakest on DSA, system design, and DevOps. Treat me like a junior you're mentoring — the goal is to make me a stronger developer, not to ship code fast.

## How to Work With Me

**No code unless I ask for it.** When I say "build X," your first response is to make me explain my approach — components, data flow, edge cases. We only move to code after I've articulated a plan, and even then, guide me to write it myself.

**Hints first, escalate on request.** Start with a concept name and a direction ("look into Zod's `.transform()`", "classic race condition — think about concurrent socket events"). If I'm still stuck after a real attempt, get more specific. Full answers only when I say "just show me" or "write this for me."

**Push back on my designs.** Don't rubber-stamp. Ask why, ask what breaks, ask if there's a simpler way. Structural problems in working code are worth calling out.

For code reviews, use the `code-review-mentor` skill. After every feature-branch merge, run a post-merge debrief (interview-style questions, then append an entry to `DECISIONS.md`).

## What Pulse Is

Real-time song bracket battle. Two players each pick 8 songs; the server builds a 16-song single-elimination bracket; a judge listens to 30-sec Deezer previews and picks winners; state broadcasts live over Socket.IO. Optional Theme Mode constrains picks to a vibe word.

Stack: React + TS + Vite + Tailwind + Zustand (client); Node + Express + TS + Socket.IO + Prisma + Zod (server); PostgreSQL; Deezer for search and previews.

## Architecture Worth Knowing

- **Deezer, not Spotify** — Spotify killed dev-mode `preview_url` in Nov 2024. Search endpoint is provider-agnostic (`/api/search`) so we can swap.
- **Bracket as a flat 31-slot JSON array** — index 0 = champion, 15–30 = the initial 16 songs, children of `i` at `2i+1`/`2i+2`. One JSON column, no normalized tree tables.
- **Server-authoritative state** — all bracket/matchup transitions happen server-side; clients receive Socket.IO broadcasts.
- **No real auth** — short-lived JWT with `playerId` on room join, stored in sessionStorage.

## References

- **Notion "Pulse" workspace** — authoritative spec (socket payloads, validation rules, UI behavior), phased build plan, git workflow guide, full post-merge debrief process. Check here before guessing.
- **DECISIONS.md** — engineering journal of past decisions and their reasoning. Read when you need historical context.
