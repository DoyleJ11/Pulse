import type { Server, Socket } from "socket.io";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  verifyToken: vi.fn(),
}));
const dbMocks = vi.hoisted(() => ({
  getAllUsers: vi.fn(),
  getUserRoleById: vi.fn(),
  getUserSessionById: vi.fn(),
  setPlayerConnected: vi.fn(),
}));
const bracketMocks = vi.hoisted(() => ({
  endGame: vi.fn(),
  resolveMatchup: vi.fn(),
}));

vi.mock("../utils/authUtils.js", async (importOriginal) => {
  const original = await importOriginal<typeof import("../utils/authUtils.js")>();
  return { ...original, verifyToken: authMocks.verifyToken };
});

vi.mock("../utils/dbUtils.js", () => dbMocks);

vi.mock("../utils/socket.js", () => ({ getIo: vi.fn() }));
vi.mock("../services/bracketService.js", () => bracketMocks);
vi.mock("../services/roomService.js", () => ({
  changeMode: vi.fn(),
  changeRole: vi.fn(),
}));

import { SessionExpiredError } from "../utils/authUtils.js";
import { registerRoomEvents } from "./roomEvents.js";

function registeredSocket(role: string) {
  const handlers = new Map<string, (data?: unknown) => unknown>();
  const socket = {
    data: {
      session: {
        userId: `${role}-1`,
        roomId: "room-1",
        code: "ABC123",
        name: role,
        role,
      },
    },
    emit: vi.fn(),
    join: vi.fn(),
    on: vi.fn((event: string, handler: (data?: unknown) => unknown) => {
      handlers.set(event, handler);
    }),
  } as unknown as Socket;
  const roomEmit = vi.fn();
  const io = {
    to: vi.fn(() => ({ emit: roomEmit })),
  } as unknown as Server;

  registerRoomEvents(io, socket);
  return { handlers, socket, roomEmit };
}

describe("joinRoom session expiry", () => {
  beforeEach(() => {
    authMocks.verifyToken.mockReset();
  });

  it("emits sessionExpired instead of a generic socket error", async () => {
    const handlers = new Map<string, (data?: unknown) => unknown>();
    const socket = {
      data: {},
      emit: vi.fn(),
      join: vi.fn(),
      on: vi.fn((event: string, handler: (data?: unknown) => unknown) => {
        handlers.set(event, handler);
      }),
    } as unknown as Socket;
    const io = {} as Server;
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    authMocks.verifyToken.mockImplementation(() => {
      throw new SessionExpiredError();
    });

    registerRoomEvents(io, socket);
    await handlers.get("joinRoom")?.({ code: "ABC123", token: "expired" });

    expect(socket.emit).toHaveBeenCalledWith("sessionExpired", {
      message: "Your room session has expired. Please join or create a new room.",
    });
    expect(socket.emit).not.toHaveBeenCalledWith(
      "error",
      expect.anything(),
    );
    expect(socket.join).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });
});

describe("atomic game-state socket events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("broadcasts a resolved judge pick with the existing payload", async () => {
    const state = [{ songId: "winner" }];
    dbMocks.getUserRoleById.mockResolvedValue("judge");
    bracketMocks.resolveMatchup.mockResolvedValue({
      state,
      currentMatchup: 8,
    });
    const { handlers, roomEmit, socket } = registeredSocket("judge");

    await handlers.get("judgePick")?.({
      matchupIndex: 7,
      winnerSongId: "winner",
    });

    expect(bracketMocks.resolveMatchup).toHaveBeenCalledWith(
      "ABC123",
      7,
      "winner",
    );
    expect(roomEmit).toHaveBeenCalledWith("bracketUpdated", {
      state,
      currentMatchup: 8,
    });
    expect(socket.emit).not.toHaveBeenCalledWith("error", expect.anything());
  });

  it("does not broadcast a stale judge pick", async () => {
    dbMocks.getUserRoleById.mockResolvedValue("judge");
    bracketMocks.resolveMatchup.mockRejectedValue(
      new Error("Current matchup does not match provided matchup"),
    );
    const { handlers, roomEmit, socket } = registeredSocket("judge");

    await handlers.get("judgePick")?.({
      matchupIndex: 7,
      winnerSongId: "winner",
    });

    expect(roomEmit).not.toHaveBeenCalled();
    expect(socket.emit).toHaveBeenCalledWith("error", {
      message: "Current matchup does not match provided matchup",
    });
  });

  it("preserves the bracket completion event and champion payload", async () => {
    const champion = { songId: "champion" };
    const state = [champion];
    dbMocks.getUserRoleById.mockResolvedValue("judge");
    bracketMocks.resolveMatchup.mockResolvedValue({
      state,
      currentMatchup: null,
    });
    const { handlers, roomEmit } = registeredSocket("judge");

    await handlers.get("judgePick")?.({
      matchupIndex: 0,
      winnerSongId: "champion",
    });

    expect(roomEmit).toHaveBeenNthCalledWith(1, "bracketUpdated", {
      state,
      currentMatchup: null,
    });
    expect(roomEmit).toHaveBeenNthCalledWith(2, "bracketComplete", {
      champion,
    });
  });

  it("broadcasts the state returned by an atomic End Game transition", async () => {
    const state = [{ songId: "current-leader" }];
    dbMocks.getUserRoleById.mockResolvedValue("player_a");
    bracketMocks.endGame.mockResolvedValue(state);
    const { handlers, roomEmit } = registeredSocket("player_a");

    await handlers.get("endGame")?.();

    expect(bracketMocks.endGame).toHaveBeenCalledWith("ABC123");
    expect(roomEmit).toHaveBeenCalledWith("roomEnded", { state });
  });

  it("does not broadcast when End Game validation fails", async () => {
    dbMocks.getUserRoleById.mockResolvedValue("player_a");
    bracketMocks.endGame.mockRejectedValue(new Error("Incorrect room status"));
    const { handlers, roomEmit, socket } = registeredSocket("player_a");

    await handlers.get("endGame")?.();

    expect(roomEmit).not.toHaveBeenCalled();
    expect(socket.emit).toHaveBeenCalledWith("error", {
      message: "Incorrect room status",
    });
  });
});
