import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
}));

vi.mock("../utils/prisma.js", () => ({
  prisma: { $transaction: mocks.transaction },
}));

import { seedSongs } from "./bracketService.js";

function songs(playerId: string, count = 8) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${playerId}-song-${index + 1}`,
    playerId,
    deezerId: String(index + 1),
    deezerRank: index + 1,
    title: `Song ${index + 1}`,
    artist: `Artist ${index + 1}`,
    albumArt: "https://example.com/cover.jpg",
    previewUrl: null,
    duration: 180,
    seed: null,
    provider: "deezer",
  }));
}

function player(id: string, role: string, count = 8) {
  return {
    id,
    roomId: "room-1",
    name: id,
    role,
    connected: true,
    lastSeenAt: new Date(),
    songs: songs(id, count),
  };
}

function transactionClient(playerA = player("player-a", "player_a")) {
  const playerB = player("player-b", "player_b");
  const tx = {
    player: {
      findFirst: vi
        .fn()
        .mockResolvedValueOnce(playerA)
        .mockResolvedValueOnce(playerB),
    },
    song: {
      update: vi.fn().mockResolvedValue(undefined),
    },
    bracket: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve(data)),
    },
  };
  return tx;
}

describe("seedSongs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses the caller's transaction for all seed and bracket writes", async () => {
    const tx = transactionClient();

    const bracket = await seedSongs(
      "ABC123",
      "room-1",
      tx as Parameters<typeof seedSongs>[2],
    );

    expect(tx.song.update).toHaveBeenCalledTimes(16);
    expect(tx.bracket.create).toHaveBeenCalledTimes(1);
    expect(bracket.roomId).toBe("room-1");
    expect(bracket.state).toHaveLength(31);
    expect(bracket.state.slice(15)).not.toContain(null);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("refuses to seed a bracket unless both players have exactly eight songs", async () => {
    const tx = transactionClient(player("player-a", "player_a", 7));

    await expect(
      seedSongs("ABC123", "room-1", tx as Parameters<typeof seedSongs>[2]),
    ).rejects.toThrow("Both players must submit exactly 8 songs");
    expect(tx.song.update).not.toHaveBeenCalled();
    expect(tx.bracket.create).not.toHaveBeenCalled();
  });
});
