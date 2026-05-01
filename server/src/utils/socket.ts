import { Server } from "socket.io";
import http from "node:http";
import { registerRoomEvents } from "../sockets/roomEvents.js";
import { allowedOrigins } from "./config.js";

let io: Server;

function initSocket(httpServer: http.Server) {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    registerRoomEvents(io, socket);
  });
}

function getIo() {
  return io;
}

export { initSocket, getIo };
