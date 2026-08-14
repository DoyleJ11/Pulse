import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  pickRandomTheme: vi.fn(() => "midnight"),
}));

vi.mock("../utils/prisma.js", () => ({
  prisma: { $transaction: mocks.transaction },
}));

vi.mock("../utils/authUtils.js", () => ({
  generateToken: vi.fn(),
}));

vi.mock("./bracketService.js", () => ({
  seedSongs: vi.fn(),
}));

vi.mock("../data/themeWords.js", () => ({
  pickRandomTheme: mocks.pickRandomTheme,
}));

import { changeRole, setToPicking } from "./roomService.js";

const user = {
  userId: "host",
  name: "Host",
  role: "player_a",
  roomId: "room-1",
};

function player(id: string, role: string) {
  return {
    id,
    name: id,
    role,
    connected: true,
    lastSeenAt: new Date(),
  };
}

function room(players: ReturnType<typeof player>[], overrides = {}) {
  return {
    id: user.roomId,
    code: "ABC123",
    hostId: user.userId,
    mode: "favorites",
    themeWord: null,
    status: "lobby",
    createdAt: new Date(),
    players,
    ...overrides,
  };
}

function transactionClient(currentRoom: ReturnType<typeof room>) {
  const tx = {
    $queryRaw: vi.fn().mockResolvedValue([{ id: currentRoom.id }]),
    room: {
      findUnique: vi.fn().mockResolvedValue(currentRoom),
      update: vi.fn().mockImplementation(({ data }) =>
        Promise.resolve({
          ...currentRoom,
          ...data,
        }),
      ),
    },
    player: {
      update: vi.fn().mockResolvedValue(undefined),
    },
  };

  mocks.transaction.mockImplementation(
    (callback: (client: typeof tx) => unknown) => callback(tx),
  );
  return tx;
}

describe("setToPicking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects a host and two spectators", async () => {
    const tx = transactionClient(
      room([
        player("host", "player_a"),
        player("guest-1", "spectator"),
        player("guest-2", "spectator"),
      ]),
    );

    await expect(setToPicking("ABC123", user)).rejects.toThrow(
      "one Player A, one Player B, and at least one judge",
    );
    expect(tx.room.update).not.toHaveBeenCalled();
  });

  it("rejects two players when no judge is present", async () => {
    const tx = transactionClient(
      room([player("host", "player_a"), player("guest", "player_b")]),
    );

    await expect(setToPicking("ABC123", user)).rejects.toThrow(
      "at least one judge",
    );
    expect(tx.room.update).not.toHaveBeenCalled();
  });

  it("rejects malformed duplicate player roles", async () => {
    const tx = transactionClient(
      room([
        player("host", "player_a"),
        player("guest-1", "player_a"),
        player("guest-2", "player_b"),
        player("guest-3", "judge"),
      ]),
    );

    await expect(setToPicking("ABC123", user)).rejects.toThrow(
      "one Player A, one Player B",
    );
    expect(tx.room.update).not.toHaveBeenCalled();
  });

  it("starts with one player per side, judges, and spectators", async () => {
    const tx = transactionClient(
      room([
        player("host", "player_a"),
        player("guest-1", "player_b"),
        player("guest-2", "judge"),
        player("guest-3", "judge"),
        player("guest-4", "spectator"),
      ]),
    );

    const result = await setToPicking("ABC123", user);

    expect(result.status).toBe("picking");
    expect(tx.room.update).toHaveBeenCalledWith({
      where: { id: user.roomId },
      data: { status: "picking" },
    });
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.room.findUnique.mock.invocationCallOrder[0]!,
    );
  });

  it("assigns a theme inside the same transaction", async () => {
    const tx = transactionClient(
      room(
        [
          player("host", "player_a"),
          player("guest-1", "player_b"),
          player("guest-2", "judge"),
        ],
        { mode: "theme" },
      ),
    );

    await setToPicking("ABC123", user);

    expect(tx.room.update).toHaveBeenCalledWith({
      where: { id: user.roomId },
      data: { status: "picking", themeWord: "midnight" },
    });
  });
});

describe("changeRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("locks the room before checking and changing a role", async () => {
    const tx = transactionClient(
      room([
        player("host", "player_a"),
        player("guest-1", "player_b"),
        player("guest-2", "judge"),
      ]),
    );

    await changeRole("guest-2", "ABC123", "spectator");

    expect(tx.$queryRaw).toHaveBeenCalledTimes(1);
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.room.findUnique.mock.invocationCallOrder[0]!,
    );
    expect(tx.player.update).toHaveBeenCalledWith({
      where: { id: "guest-2" },
      data: { role: "spectator" },
    });
  });

  it("rejects the role change if starting won the room lock", async () => {
    const tx = transactionClient(
      room(
        [
          player("host", "player_a"),
          player("guest-1", "player_b"),
          player("guest-2", "judge"),
        ],
        { status: "picking" },
      ),
    );

    await expect(
      changeRole("guest-2", "ABC123", "spectator"),
    ).rejects.toThrow("Roles are locked once the game has started");
    expect(tx.player.update).not.toHaveBeenCalled();
  });
});
