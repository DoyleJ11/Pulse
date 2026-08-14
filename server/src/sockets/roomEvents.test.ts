import type { Server, Socket } from "socket.io";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  verifyToken: vi.fn(),
}));

vi.mock("../utils/authUtils.js", async (importOriginal) => {
  const original = await importOriginal<typeof import("../utils/authUtils.js")>();
  return { ...original, verifyToken: authMocks.verifyToken };
});

vi.mock("../utils/dbUtils.js", () => ({
  getAllUsers: vi.fn(),
  getUserRoleById: vi.fn(),
  getUserSessionById: vi.fn(),
  setPlayerConnected: vi.fn(),
}));

vi.mock("../utils/socket.js", () => ({ getIo: vi.fn() }));
vi.mock("../services/bracketService.js", () => ({
  endGame: vi.fn(),
  getBracketState: vi.fn(),
  isValidPick: vi.fn(),
  updateBracket: vi.fn(),
}));
vi.mock("../services/roomService.js", () => ({
  changeMode: vi.fn(),
  changeRole: vi.fn(),
}));

import { SessionExpiredError } from "../utils/authUtils.js";
import { registerRoomEvents } from "./roomEvents.js";

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
