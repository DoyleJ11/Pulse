import { Server } from "socket.io";
import http from "node:http";
import { registerRoomEvents } from "../sockets/roomEvents.js";

let io: Server;

function initSocket(httpServer: http.Server) {
  io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    registerRoomEvents(io, socket);
  });
}

function getIo() {
  return io;
}

export { initSocket, getIo };
