import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
}));

vi.mock("../utils/prisma.js", () => ({
  prisma: { $transaction: mocks.transaction },
}));

import { endGame, resolveMatchup } from "./bracketService.js";

function slot(index: number) {
  return {
    songId: `song-${index}`,
    deezerId: String(index),
    title: `Song ${index}`,
    artist: "Test Artist",
    albumArt: "https://example.com/cover.jpg",
    previewUrl: null,
    duration: 180,
    submittedBy: "player-a",
    role: "player_a",
    seed: 1,
  };
}

function freshBracket() {
  const state: (ReturnType<typeof slot> | null)[] = Array(31).fill(null);
  for (let index = 15; index <= 30; index += 1) {
    state[index] = slot(index);
  }
  return state;
}

function finalBracket() {
  const state = freshBracket();
  for (let index = 1; index <= 14; index += 1) {
    state[index] = slot(index);
  }
  return state;
}

function roomState(options?: {
  status?: string;
  state?: ReturnType<typeof freshBracket>;
  currentMatchup?: number | null;
  bracket?: boolean;
}) {
  const state = options?.state ?? freshBracket();
  return {
    id: "room-1",
    code: "ABC123",
    hostId: "player-a",
    mode: "favorites",
    themeWord: null,
    status: options?.status ?? "battling",
    createdAt: new Date(),
    bracket:
      options?.bracket === false
        ? null
        : {
            id: "bracket-1",
            roomId: "room-1",
            state,
            currentMatchup: options?.currentMatchup ?? 7,
          },
  };
}

function transactionClient(
  currentRoom: ReturnType<typeof roomState>,
  lockResult: Array<{ id: string }> = [{ id: currentRoom.id }],
) {
  const tx = {
    $queryRaw: vi.fn().mockResolvedValue(lockResult),
    room: {
      findUnique: vi.fn().mockResolvedValue(currentRoom),
      update: vi.fn().mockResolvedValue(undefined),
    },
    bracket: {
      update: vi.fn().mockResolvedValue(undefined),
    },
  };
  mocks.transaction.mockImplementation(
    (callback: (client: typeof tx) => unknown) => callback(tx),
  );
  return tx;
}

describe("resolveMatchup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("locks, validates, and advances a matchup in one transaction", async () => {
    const tx = transactionClient(roomState());

    const result = await resolveMatchup("ABC123", 7, "song-15");

    const query = tx.$queryRaw.mock.calls[0]?.[0].join("");
    expect(query).toContain('SELECT "id" FROM "Room"');
    expect(query).toContain("FOR UPDATE");
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.room.findUnique.mock.invocationCallOrder[0]!,
    );
    expect(result.currentMatchup).toBe(8);
    expect(result.state[7]?.songId).toBe("song-15");
    expect(tx.bracket.update).toHaveBeenCalledWith({
      where: { roomId: "room-1" },
      data: {
        state: result.state,
        currentMatchup: 8,
      },
    });
    expect(tx.room.update).not.toHaveBeenCalled();
  });

  it("rejects a stale or duplicate matchup without writing", async () => {
    const tx = transactionClient(roomState({ currentMatchup: 8 }));

    await expect(resolveMatchup("ABC123", 7, "song-15")).rejects.toThrow(
      "Current matchup does not match provided matchup",
    );
    expect(tx.bracket.update).not.toHaveBeenCalled();
    expect(tx.room.update).not.toHaveBeenCalled();
  });

  it("rejects a winner outside the active matchup", async () => {
    const tx = transactionClient(roomState());

    await expect(resolveMatchup("ABC123", 7, "song-30")).rejects.toThrow(
      "Winner does not match either matchup children",
    );
    expect(tx.bracket.update).not.toHaveBeenCalled();
  });

  it("updates the bracket and completes the room on the final matchup", async () => {
    const tx = transactionClient(
      roomState({ state: finalBracket(), currentMatchup: 0 }),
    );

    const result = await resolveMatchup("ABC123", 0, "song-1");

    expect(result.currentMatchup).toBeNull();
    expect(result.state[0]?.songId).toBe("song-1");
    expect(tx.bracket.update).toHaveBeenCalledTimes(1);
    expect(tx.room.update).toHaveBeenCalledWith({
      where: { id: "room-1" },
      data: { status: "complete" },
    });
  });
});

describe("endGame", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the bracket state and completes an active battle", async () => {
    const currentRoom = roomState();
    const tx = transactionClient(currentRoom);

    const state = await endGame("ABC123");

    expect(state).toBe(currentRoom.bracket?.state);
    expect(tx.room.update).toHaveBeenCalledWith({
      where: { id: "room-1" },
      data: { status: "complete" },
    });
  });

  it("rejects a lobby event without changing room status", async () => {
    const tx = transactionClient(roomState({ status: "lobby" }));

    await expect(endGame("ABC123")).rejects.toThrow("Incorrect room status");
    expect(tx.room.update).not.toHaveBeenCalled();
  });

  it("rejects an active room without a bracket", async () => {
    const tx = transactionClient(roomState({ bracket: false }));

    await expect(endGame("ABC123")).rejects.toThrow("Cannot find bracket");
    expect(tx.room.update).not.toHaveBeenCalled();
  });

  it("rejects a missing room before attempting any state read or write", async () => {
    const tx = transactionClient(roomState(), []);

    await expect(endGame("ABC123")).rejects.toThrow("Cannot find room");
    expect(tx.room.findUnique).not.toHaveBeenCalled();
    expect(tx.room.update).not.toHaveBeenCalled();
  });
});
