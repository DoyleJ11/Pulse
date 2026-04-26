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

// kept for potential kick logic
async function removeUser(userId: string) {
  await prisma.player.delete({
    where: { id: userId },
  });
}

async function setPlayerConnected(userId: string, connected: boolean) {
  await prisma.player.update({
    where: { id: userId },
    data: { connected: connected },
  });
}

async function getUserRoleById(userId: string) {
  const user = await prisma.player.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error(`Cannot find user with id: ${userId}`);
  }

  return user.role;
}

export { getAllUsers, removeUser, getUserRoleById, setPlayerConnected };
