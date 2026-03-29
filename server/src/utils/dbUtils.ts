import { prisma } from "../utils/prisma.js";
import { RoomError } from "../utils/customErrors.js";

async function getAllUsers(code: string) {
  const roomData = await prisma.room.findUnique({
    where: { code: code },
    include: {
      players: {
        omit: { roomId: true },
      },
    },
  });
  if (!roomData) {
    throw new RoomError(`Cannot find users in room: ${code}`, code, "getUsers");
  }

  return { players: roomData.players, hostId: roomData.hostId };
}

async function removeUser(userId: string) {
  await prisma.player.delete({
    where: { id: userId },
  });
}

export { getAllUsers, removeUser };
