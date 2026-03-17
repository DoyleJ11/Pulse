import { z } from "zod";

const RoomSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  role: z.string(),
  jwt: z.string(),
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

const SongSchema = z.object({
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
export type Song = z.infer<typeof SongSchema>;

async function searchSong(query: string) {
  const response = await fetchHelper(`/api/search?q=${query}`, "GET");

  const data = SongSchema.array().parse(await response);
  return data;
}

async function fetchHelper(url: string, method: string, body?: object) {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error. status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export { createRoom, joinRoom, searchSong };
