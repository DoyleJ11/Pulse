import type { Server, Socket } from "socket.io";
import { z, ZodError } from "zod";
import {
  getAllUsers,
  setPlayerConnected,
  getUserRoleById,
  getUserSessionById,
} from "../utils/dbUtils.js";
import { getIo } from "../utils/socket.js";
import { verifyToken } from "../utils/authUtils.js";
import {
  isValidPick,
  updateBracket,
  endGame,
  getBracketState,
} from "../services/bracketService.js";
import { changeRole } from "../services/roomService.js";

const CodeSchema = z.string().trim().length(6, "Room code must be 6 characters");

const JoinRoomSchema = z.object({
  code: CodeSchema,
  token: z.string().min(1, "Session token is required"),
});

const PickUpdateSchema = z.object({
  songCount: z.number().int().min(0).max(8),
  lockedIn: z.boolean(),
});

const JudgePickSchema = z.object({
  matchupIndex: z.number().int().min(0).max(14),
  winnerSongId: z.string().min(1),
});

interface SocketSession {
  userId: string;
  roomId: string;
  code: string;
  name: string;
  role: string;
}

function registerRoomEvents(io: Server, socket: Socket) {
  socket.on("joinRoom", async (data) => {
    try {
      const { code, token } = JoinRoomSchema.parse(data);
      const payload = verifyToken(token);
      const user = await getUserSessionById(payload.userId);

      if (!user) {
        throw new Error("Could not find user for this session");
      }
      if (user.roomId !== payload.roomId || user.room.code !== code) {
        throw new Error("Session does not match this room");
      }

      socket.data.session = {
        userId: user.id,
        roomId: user.roomId,
        code: user.room.code,
        name: user.name,
        role: user.role,
      } satisfies SocketSession;

      socket.join(user.room.code);
      await setPlayerConnected(user.id, true);

      const users = await getAllUsers(user.room.code);
      io.to(user.room.code).emit("roomState", {
        users: users.players,
        hostId: users.hostId,
      });
    } catch (err) {
      console.error("Failed to join room", err);
      emitSocketError(socket, err, "Could not join room");
    }
  });

  socket.on("disconnect", async () => {
    try {
      const session = getSocketSession(socket);
      if (!session) return;

      await setPlayerConnected(session.userId, false);

      const users = await getAllUsers(session.code);
      io.to(session.code).emit("roomState", {
        users: users.players,
        hostId: users.hostId,
      });
    } catch (err) {
      console.error("Failed to remove user", err);
    }
  });

  socket.on("changeRole", async (data) => {
    try {
      const { code, userId } = socket.data;
      if (!code || !userId) {
        throw new Error("Not joined to a room");
      }

      await changeRole(userId, code, data?.newRole);

      const users = await getAllUsers(code);
      io.to(code).emit("roomState", {
        users: users.players,
        hostId: users.hostId,
      });
    } catch (err) {
      console.error("Failed to change role", err);
      socket.emit("error", {
        message: err instanceof Error ? err.message : "Could not change role",
      });
    }
  });

  socket.on("pickUpdate", (data) => {
    try {
      const session = requireSocketSession(socket);
      const { songCount, lockedIn } = PickUpdateSchema.parse(data);
      if (session.role !== "player_a" && session.role !== "player_b") {
        throw new Error("Only players can update pick status");
      }

      io.to(session.code).emit("pickUpdate", {
        songCount,
        userId: session.userId,
        name: session.name,
        role: session.role,
        lockedIn,
      });
    } catch (err) {
      console.error("Failed to emit pickUpdate event", err);
      emitSocketError(socket, err, "Could not update pick status");
    }
  });

  socket.on("judgePick", async (data) => {
    try {
      const session = requireSocketSession(socket);
      const { matchupIndex, winnerSongId } = JudgePickSchema.parse(data);
      const role = await getUserRoleById(session.userId);
      if (role === "judge" && session.role === "judge") {
        await isValidPick(session.code, matchupIndex, winnerSongId);

        const { state, currentMatchup } = await updateBracket(
          session.code,
          matchupIndex,
          winnerSongId,
        );
        io.to(session.code).emit("bracketUpdated", { state, currentMatchup });

        if (currentMatchup === null) {
          io.to(session.code).emit("bracketComplete", { champion: state[0] });
        }
      } else {
        throw new Error("Only judges can submit picks");
      }
    } catch (err) {
      emitSocketError(socket, err, "Failed to submit judge pick");
    }
  });

  socket.on("endGame", async () => {
    try {
      const session = requireSocketSession(socket);
      const role = await getUserRoleById(session.userId);
      if (role === "spectator" || session.role === "spectator") {
        throw new Error("Spectators cannot end game");
      }

      await endGame(session.code);
      const state = await getBracketState(session.code);
      io.to(session.code).emit("roomEnded", { state });
    } catch (err) {
      emitSocketError(socket, err, "Failed to end game");
    }
  });
}

function getSocketSession(socket: Socket): SocketSession | null {
  const session = socket.data.session as SocketSession | undefined;
  return session ?? null;
}

function requireSocketSession(socket: Socket): SocketSession {
  const session = getSocketSession(socket);
  if (!session) {
    throw new Error("Socket has not joined a room");
  }

  return session;
}

function getSocketErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function emitSocketError(socket: Socket, error: unknown, fallback: string) {
  socket.emit("error", { message: getSocketErrorMessage(error, fallback) });
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
