import { z } from "zod";

const RoomSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  role: z.string(),
  jwt: z.string(),
});

type RoomResponse = z.infer<typeof RoomSchema>;

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

async function fetchHelper(url: string, method: string, body: object) {
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

export { createRoom, joinRoom };
