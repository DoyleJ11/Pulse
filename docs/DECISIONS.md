# Pulse Decisions

## 2026-05-01 — Production Deployment Topology

Decision: deploy the React client and Node/Socket.IO server as separate origins.

- Client host: Vercel
- Server host: Railway
- Database: Railway PostgreSQL

Why:

- It matches the portfolio story: separate frontend, backend, and database.
- It makes CORS, WebSocket origins, and environment variables explicit.
- Railway supports long-running Node processes and WebSocket connections.

Tradeoff:

- Separate origins require explicit `ALLOWED_ORIGINS`, `VITE_API_URL`, and
  `VITE_SOCKET_URL`.

## 2026-05-01 — CORS And Socket.IO Origins

Decision: keep the allowed browser origins on the server in `ALLOWED_ORIGINS`.

Express uses the parsed origin list before route registration. Socket.IO uses
the same origin list in its server constructor. Browser requests from origins
outside the list are rejected.

Why:

- Express CORS and Socket.IO CORS are configured separately.
- The client should not decide which origins are trusted.
- Pulse uses bearer JWTs, so credentialed cookie CORS is not needed for v1.

## 2026-05-01 — Server-Backed Session Recovery

Decision: add `GET /api/rooms/:code/state` as the canonical refresh/rejoin
endpoint.

The endpoint requires a JWT and returns the room status, host id, player list,
current user, and bracket if one exists. The client uses it on app load to route
the user back to lobby, picking, bracket, or postgame.

Why:

- Local storage alone cannot be trusted as the source of room truth.
- Refresh behavior should follow server state, not client guesses.

## 2026-05-01 — Room Expiration

Decision: expire incomplete rooms after 24 hours and completed rooms after 7
days.

Expired rooms cannot be joined or recovered. A manual cleanup command deletes
expired rooms and their related bracket, songs, and players.

Why:

- Hosted Postgres should not accumulate abandoned room data forever.
- Manual cleanup is enough for first public testing; scheduled cleanup can come
  later.
