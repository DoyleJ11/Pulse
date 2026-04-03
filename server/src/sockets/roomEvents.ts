import type { Server, Socket } from "socket.io";
import { getAllUsers, removeUser } from "../utils/dbUtils.js";
import { getIo } from "../utils/socket.js";

const disconnectMap: Map<string, NodeJS.Timeout> = new Map<
  string,
  NodeJS.Timeout
>();

function registerRoomEvents(io: Server, socket: Socket) {
  socket.on("joinRoom", async (data) => {
    try {
      socket.data.userId = data.id;
      socket.data.code = data.code;

      const wasDisconnected = disconnectMap.get(socket.data.userId);

      if (wasDisconnected) {
        clearTimeout(wasDisconnected);
      }

      socket.join(data.code);
      const users = await getAllUsers(data.code);
      io.to(data.code).emit("roomState", { users: users.players, hostId: users.hostId });
    } catch (err) {
      console.error("Failed to join room", err);
      socket.emit("error", { message: "Could not join room" });
    }
  });

  socket.on("disconnect", async () => {
    try {
      const { code } = socket.data;
      const { userId } = socket.data;
      if (!code) return;

      const timerId: NodeJS.Timeout = setTimeout(async () => {
        try {
          await removeUser(userId);
          const users = await getAllUsers(code);
          io.to(code).emit("roomState", { users: users.players, hostId: users.hostId });
        } catch (err) {
          console.error("Failed to remove user", err);
        }
      }, 15000);

      disconnectMap.set(userId, timerId);

      const users = await getAllUsers(code);
      io.to(code).emit("roomState", { users: users.players, hostId: users.hostId });
    } catch (err) {
      console.error("Failed to remove user", err);
      socket.emit("error", { message: "Could not disconnect" });
    }
  });

  socket.on("pickUpdate", (data) => {
    try {
      io.to(data.code).emit("pickUpdate", {
        songCount: data.songCount,
        userId: data.userId,
        name: data.name,
        role: data.role,
        lockedIn: data.lockedIn,
      })
    } catch (error) {
      console.error("Failed to emit pickUpdate event")
    }
  })

}

function submissionComplete(code: string) {
  try {
    const io = getIo()
    io.to(code).emit("submissionComplete")
  } catch (err) {
    console.error("Failed to emit submission event")
  }
}

function startPicking(code: string, status: string) {
  try {
    const io = getIo()
    io.to(code).emit("startPicking", { status })
  } catch (err) {
    console.error("Failed to emit startPicking event")
  }
}

export { registerRoomEvents, submissionComplete, startPicking };
