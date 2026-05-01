# Pulse

Pulse is a real-time song bracket battle. Two players each pick 8 songs, the
server builds a 16-song bracket, and a judge listens to Deezer previews to pick
winners live over Socket.IO.

## Architecture

- Client: React, TypeScript, Vite, Tailwind, Zustand, Socket.IO client
- Server: Node, Express, TypeScript, Socket.IO, Prisma, Zod, PostgreSQL
- Music provider: Deezer search and 30-second previews through `GET /api/search`
- Auth model: short-lived room JWTs, no permanent accounts
- Bracket model: one 31-slot JSON array, with champion at index `0`

The server is authoritative for room state, submissions, bracket advancement,
and socket permissions. Clients request actions; the server validates and
broadcasts the resulting state.

## Local Setup

Install dependencies separately:

```bash
cd server
npm install

cd ../client
npm install
```

Create env files from the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Server env:

- `DATABASE_URL`: local or hosted PostgreSQL connection string
- `JWT_SECRET`: at least 32 random characters
- `PORT`: local server port, defaults to `3001`
- `ALLOWED_ORIGINS`: comma-separated browser origins allowed by CORS
- `NODE_ENV`: `development`, `test`, or `production`

Client env:

- `VITE_API_URL`: HTTP origin for the server, such as `http://localhost:3001`
- `VITE_SOCKET_URL`: Socket.IO origin for the server

Run locally:

```bash
cd server
npm run dev

cd ../client
npm run dev
```

## Production Deployment

Recommended topology:

- Client: Vercel
- Server: Railway Node service
- Database: Railway PostgreSQL

Use separate origins. For example:

- Client origin: `https://pulse.vercel.app`
- Server origin: `https://pulse-api.up.railway.app`

Railway server env:

```text
DATABASE_URL=<Railway Postgres connection string>
JWT_SECRET=<32+ character random secret>
ALLOWED_ORIGINS=https://pulse.vercel.app
NODE_ENV=production
```

Vercel client env:

```text
VITE_API_URL=https://pulse-api.up.railway.app
VITE_SOCKET_URL=https://pulse-api.up.railway.app
```

Server commands:

```bash
npm run build
npm run start
npm run migrate:deploy
```

`ALLOWED_ORIGINS` lives on the server because the server decides which browser
origins can call the API and open Socket.IO connections. Express CORS is applied
before routes so every route response can include the correct CORS headers.
Socket.IO receives the same allowed-origin list because WebSocket handshakes are
configured separately from Express middleware.

## Production Readiness Checklist

- `GET /api/health` returns `{ "status": "online" }`
- Deployed client can create and join rooms through the deployed server
- Three browsers/devices can complete a full game
- Refresh in lobby, picking, bracket, and postgame restores from server state
- Expired/stale rooms are rejected instead of trapping users
- `npm run build` passes in `client`
- `npm run build` and `npm run test:run` pass in `server`
- Railway logs show startup, socket connections, and request errors clearly

## Maintenance Commands

Run expired room cleanup manually:

```bash
cd server
npm run cleanup:rooms
```

Incomplete rooms expire after 24 hours. Completed rooms expire after 7 days.
