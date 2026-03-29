import { z } from "zod";
import { type Role, type Status } from "../types/sharedTypes";

const RoomSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  role: z.enum(["player_a", "player_b", "judge", "spectator"]) satisfies z.ZodType<Role>,
  jwt: z.string(),
});

const StatusSchema = z.object({
  status: z.enum(["lobby", "picking", "battling", "complete"]) satisfies z.ZodType<Status>,
});

async function createRoom(name: string) {
  const body = { name: name };
  const response = await fetchHelper("/api/rooms", "POST", body);

  return RoomSchema.parse(response);
}

async function joinRoom(name: string, code: string) {
  const body = { name: name };
  const response = await fetchHelper(`/api/rooms/${code}/join`, "POST", body);

  return RoomSchema.parse(response);
}

async function startPicking(code: string, token: string) {
  const response = await fetchHelper(`/api/rooms/${code}/startPicking`, "POST", undefined, token)

  return StatusSchema.parse(response);
}

const DeezerSchema = z.object({
  id: z.number(),
  title: z.string(),
  title_short: z.string(),
  duration: z.number(),
  preview: z.string(),
  artist: z.object({
    id: z.number(),
    name: z.string(),
    picture_medium: z.string(),
    picture_big: z.string(),
    picture_xl: z.string(),
  }),
  album: z.object({
    id: z.number(),
    title: z.string(),
    cover_medium: z.string(),
    cover_big: z.string(),
    cover_xl: z.string(),
  }),
});
export type DeezerSong = z.infer<typeof DeezerSchema>;

async function searchSong(query: string) {
  const response = await fetchHelper(`/api/search?q=${query}`, "GET");

  const data = DeezerSchema.array().parse(await response);
  return data;
}

const SongSchema = z.object({
    id: z.string(),
    title: z.string(),
    artist: z.string(),
    deezerId: z.string(),
    albumArt: z.string(),
    previewUrl: z.string().nullable(),
    seed: z.number().nullable(),
    provider: z.string(),
    playerId: z.string(),
})

const SongsSchema = z.array(SongSchema);


async function fetchHelper(url: string, method: string, body?: object, token?: string) {
  let headers: { [key: string]: string } = {
    "Content-Type": "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error. status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export { createRoom, joinRoom, searchSong, startPicking };
