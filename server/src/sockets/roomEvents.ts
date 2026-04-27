import type { Server, Socket } from "socket.io";
import {
  getAllUsers,
  setPlayerConnected,
  getUserRoleById,
} from "../utils/dbUtils.js";
import { getIo } from "../utils/socket.js";
import {
  isValidPick,
  updateBracket,
  endGame,
  getBracketState,
} from "../services/bracketService.js";

function registerRoomEvents(io: Server, socket: Socket) {
  socket.on("joinRoom", async (data) => {
    try {
      socket.data.userId = data.id;
      socket.data.code = data.code;

      socket.join(data.code);
      await setPlayerConnected(data.id, true);

      const users = await getAllUsers(data.code);
      io.to(data.code).emit("roomState", {
        users: users.players,
        hostId: users.hostId,
      });
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

      await setPlayerConnected(userId, false);

      const users = await getAllUsers(code);
      io.to(code).emit("roomState", {
        users: users.players,
        hostId: users.hostId,
      });
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
      });
    } catch (error) {
      console.error("Failed to emit pickUpdate event");
    }
  });

  socket.on("judgePick", async (data) => {
    try {
      const role = await getUserRoleById(socket.data.userId);
      if (role === "judge") {
        await isValidPick(data.code, data.matchupIndex, data.winnerSongId);

        const { state, currentMatchup } = await updateBracket(
          data.code,
          data.matchupIndex,
          data.winnerSongId,
        );
        io.to(data.code).emit("bracketUpdated", { state, currentMatchup });

        if (currentMatchup === null) {
          io.to(data.code).emit("bracketComplete", { champion: state[0] });
        }
      } else {
        throw new Error("Only judges can submit picks");
      }
    } catch (error) {
      socket.emit("error", { message: "Failed to emit bracketUpdated event" });
    }
  });

  socket.on("endGame", async () => {
    try {
      const role = await getUserRoleById(socket.data.userId);
      if (role === "spectator") {
        throw new Error("Spectators cannot end game");
      }

      await endGame(socket.data.code);
      const state = await getBracketState(socket.data.code);
      io.to(socket.data.code).emit("roomEnded", { state });
    } catch (error) {
      socket.emit("error", { message: "Failed to end game" });
    }
  });
}

function submissionComplete(code: string) {
  try {
    const io = getIo();
    io.to(code).emit("submissionComplete");
  } catch (err) {
    console.error("Failed to emit submission event");
  }
}

function startPicking(code: string, status: string) {
  try {
    const io = getIo();
    io.to(code).emit("startPicking", { status });
  } catch (err) {
    console.error("Failed to emit startPicking event");
  }
}

export { registerRoomEvents, submissionComplete, startPicking };
