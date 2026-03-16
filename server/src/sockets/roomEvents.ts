import type { Server, Socket } from "socket.io";
import { getAllUsers, removeUser } from "../utils/dbUtils.js";

const disconnectMap: Map<string, NodeJS.Timeout> = new Map<
  string,
  NodeJS.Timeout
>();

function registerRoomEvents(io: Server, socket: Socket) {
  socket.on("joinRoom", async (data) => {
    try {
      socket.data.userId = data.id;
      socket.data.code = data.code;

      if (disconnectMap.get(socket.data.userId)) {
        clearTimeout(disconnectMap.get(socket.data.userId));
      }

      socket.join(data.code);
      const users = await getAllUsers(data.code);
      io.to(data.code).emit("roomState", users);
    } catch (err) {
      console.error("Failed to join room", err);
      //   throw new Error(`Could not join room`);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const { code } = socket.data;
      const { userId } = socket.data;
      if (!code) return;

      const timerId: NodeJS.Timeout = setTimeout(async () => {
        await removeUser(userId);
        const users = await getAllUsers(code);
        io.to(code).emit("roomState", users);
      }, 15000);

      disconnectMap.set(userId, timerId);

      const users = await getAllUsers(code);
      io.to(code).emit("roomState", users);
    } catch (err) {
      console.error("Failed to remove user", err);
      //   throw new Error(`Could not remove user`);
    }
  });
}

export { registerRoomEvents };
