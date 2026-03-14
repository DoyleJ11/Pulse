import type { Server, Socket } from "socket.io";

function registerRoomEvents(io: Server, socket: Socket) {
  socket.on("joinRoom", (data) => {
    socket.join(data.code);
    io.to(data.code).emit("playerJoined", { username: data.username });
  });

  socket.on("leaveRoom", (data) => {
    socket.leave(data.code);
    io.to(data.code).emit("playerLeft", { username: data.username });
  });
}

export { registerRoomEvents };
