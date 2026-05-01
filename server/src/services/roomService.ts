import { nanoid } from "nanoid";
import { prisma } from "../utils/prisma.js";
import type { PrismaTransactionalClient } from "../utils/prisma.js";
import crypto from "crypto";
import { generateToken } from "../utils/authUtils.js";
import type { Room } from "../../generated/prisma/client.js";
import { RoomError } from "../utils/customErrors.js";
import { type Song } from "../routes/rooms.js";
import type { Payload } from "../utils/authUtils.js";
import { seedSongs } from "./bracketService.js";

async function createRoom(name: string) {
  const roomCode = generateCode();
  const hostId = crypto.randomUUID();

  const result = await prisma.$transaction(async (tx) => {
    const room = await tx.room.create({
      data: {
        code: roomCode,
        hostId: hostId,
      },
    });

    const host = await tx.player.create({
      data: {
        id: hostId,
        name: name,
        role: "player_a",
        roomId: room.id,
      },
    });

    const payload = {
      userId: host.id,
      name: host.name,
      role: host.role,
      roomId: host.roomId,
    };

    const token = generateToken(payload);

    return { room, host, token };
  });
  return result;
}

async function joinRoom(name: string, code: string) {
  const result = await prisma.$transaction(async (tx) => {
    const room = await tx.room.findUnique({
      where: { code: code },
    });
    if (!room) {
      throw new RoomError(`Cannot find room with code: ${code}`, code, "join");
    }
    if (room.status !== "lobby") {
      throw new RoomError(`Cannot join a room in progress.`, code, "join");
    }

    const playerRole = await determineRole(room, tx);

    const user = await tx.player.create({
      data: {
        name: name,
        role: playerRole,
        roomId: room.id,
      },
    });

    const payload = {
      userId: user.id,
      name: user.name,
      role: user.role,
      roomId: user.roomId,
    };

    const token = generateToken(payload);

    return { room, user, token };
  });

  return result;
}

async function setToPicking(code: string, user: Payload) {
  const room = await prisma.room.findUnique({
    where: { id: user?.roomId },
    include: {
      players: {
        omit: { roomId: true },
      },
    }
  });
  if (!room) {
    throw new RoomError(`Cannot find room with id: ${user.roomId}`, code, "lobby");
  }
  if (room.status !== "lobby") {
    throw new RoomError(`Must be in the lobby phase to start picking`, room.code, "lobby")
  }
  if (room.code !== code) {
    throw new RoomError(`Provided code does not match user's room code: ${code}`, code, "lobby");
  }
  if (room.hostId !== user.userId) {
    throw new RoomError(`Room hostId does not match user's ID`, code, "lobby");
  }
  if (room.players.length < 3) {
    throw new RoomError(`Must have at least two players & one judge to start picking`, room.code, "lobby")
  }

  const updatedRoom = await prisma.room.update({
    where: {code: code},
    data: {status: "picking"}
  });

  return updatedRoom;
}

async function submitPicks(songs: Song[], user: Payload, code: string) {
  // Zod already verified the shape & size of array for us.
  const room = await prisma.room.findUnique({
    where: { id: user?.roomId },
  });
  if (!room) {
    throw new RoomError(`Cannot find room with id: ${user.roomId}`, code, "picking");
  }
  if (room.status !== "picking") {
    throw new RoomError(`Cannot submit songs to a room outside of picking phase`, room.code, "picking");
  }
  if (room.code !== code) {
    throw new RoomError(`Provided code does not match user's room code: ${code}`, code, "picking");
  }

  const player = await prisma.player.findUnique({
    where: { id: user.userId },
    include: {
      songs: true,
    }
  })
  if (!player) {
    throw new Error(`Could not find player with id ${user.userId}`)
  }
  if (player.songs && player.songs.length !== 0) {
    throw new Error('User already submitted songs.')
  }
  if (player.role !== "player_a" && player.role !== "player_b") {
    throw new Error(`Only players can submit songs.`)
  }

  const createPromises = songs.map(song =>
    prisma.song.create({
      data: {
        playerId: user.userId,
        deezerId: song.deezerId,
        deezerRank: song.deezerRank,
        title: song.title,
        artist: song.artist,
        albumArt: song.albumArt,
        previewUrl: song.preview,
        duration: song.duration,
        seed: null,
      },
    })
  )

  const newSongs = await prisma.$transaction(createPromises);
  const bothPlayersReady = await checkPlayersSubmitted(user.roomId)

  if (bothPlayersReady) {
    await seedSongs(code);
    await prisma.room.update({
      data: {
        status: "battling",
      },
      where: { id: user?.roomId }
    })
  }

  return { newSongs, bothPlayersReady };
}

async function checkPlayersSubmitted(roomId: string) {
  // Get all players in given room, including songs.
  const players = await prisma.player.findMany({
    where: { roomId: roomId, OR: [{role: "player_a"}, {role: "player_b"}] },
    include: {songs: true}
  })

  if (players.length === 0) {
    throw new Error(`No players were found in room ${roomId}`)
  }

  if (players.length !== 2) {
    throw new Error(`There must be 2 players before submitting.`)
  }

  const allSubmitted = players.every((player) => player.songs.length > 0)

  return allSubmitted;
}


const VALID_ROLES = ["player_a", "player_b", "judge", "spectator"] as const;
type ValidRole = (typeof VALID_ROLES)[number];

async function changeRole(userId: string, code: string, newRole: unknown) {
  if (typeof newRole !== "string" || !VALID_ROLES.includes(newRole as ValidRole)) {
    throw new RoomError("Invalid role.", code, "changeRole");
  }

  await prisma.$transaction(async (tx) => {
    const room = await tx.room.findUnique({
      where: { code: code },
      include: { players: true },
    });
    if (!room) {
      throw new RoomError(`Cannot find room with code: ${code}`, code, "changeRole");
    }
    if (room.status !== "lobby") {
      throw new RoomError("Roles are locked once the game has started.", code, "changeRole");
    }

    const me = room.players.find((p) => p.id === userId);
    if (!me) {
      throw new RoomError("You're not in this room.", code, "changeRole");
    }
    if (me.role === newRole) return;

    if (newRole === "player_a" || newRole === "player_b") {
      const taken = room.players.some(
        (p) => p.id !== userId && p.role === newRole,
      );
      if (taken) {
        const label = newRole === "player_a" ? "Player A" : "Player B";
        throw new RoomError(`${label} is already taken.`, code, "changeRole");
      }
    }

    await tx.player.update({
      where: { id: userId },
      data: { role: newRole },
    });
  });
}

async function determineRole(room: Room, tx: PrismaTransactionalClient) {
  const players = await tx.player.findMany({
    where: { roomId: room.id },
  });

  const takenRoles = new Set(players.map((p) => p.role));

  if (!takenRoles.has("player_a")) return "player_a";
  if (!takenRoles.has("player_b")) return "player_b";
  if (!takenRoles.has("judge")) return "judge";
  return "spectator";
}

function generateCode() {
  return nanoid(6);
}

export { createRoom, joinRoom, submitPicks, setToPicking, changeRole };
