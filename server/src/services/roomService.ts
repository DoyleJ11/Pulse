import { nanoid } from "nanoid";
import { prisma } from "../index.js";
import crypto from "crypto";
import { generateToken } from "../utils/authUtils.js";
import type { Room } from "../../generated/prisma/client.js";
import type { PrismaTransactionalClient } from "../index.js";
import { RoomError } from "../utils/customErrors.js";

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

async function determineRole(room: Room, tx: PrismaTransactionalClient) {
  const players = await tx.player.findMany({
    where: { roomId: room.id },
  });

  const playerCount = players.length;

  switch (playerCount) {
    case 1:
      return "player_b";
    case 2:
      return "judge";
    default:
      return "spectator";
  }
}

function generateCode() {
  return nanoid(6);
}

export { createRoom, joinRoom };
