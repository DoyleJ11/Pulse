import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  seedSongs: vi.fn(),
}));

vi.mock("../utils/prisma.js", () => ({
  prisma: { $transaction: mocks.transaction },
}));

vi.mock("../utils/authUtils.js", () => ({
  generateToken: vi.fn(),
}));

vi.mock("./bracketService.js", () => ({
  seedSongs: mocks.seedSongs,
}));

import { submitPicks } from "./roomService.js";

const room = {
  id: "room-1",
  code: "ABC123",
  hostId: "player-a",
  mode: "favorites",
  themeWord: null,
  status: "picking",
  createdAt: new Date(),
};

const user = {
  userId: "player-a",
  name: "Player A",
  role: "player_a",
  roomId: room.id,
};

function submission() {
  return Array.from({ length: 8 }, (_, index) => ({
    deezerId: String(index + 1),
    deezerRank: 1000 + index,
    title: `Song ${index + 1}`,
    artist: `Artist ${index + 1}`,
    albumArt: `https://e-cdns-images.dzcdn.net/images/cover/${index + 1}.jpg`,
    duration: 180 + index,
    preview: `https://cdns-preview-${index}.dzcdn.net/stream/${index + 1}.mp3`,
  }));
}

function storedSongs(playerId = user.userId) {
  return submission().map((song, index) => ({
    id: `${playerId}-song-${index + 1}`,
    playerId,
    deezerId: song.deezerId,
    deezerRank: song.deezerRank,
    title: song.title,
    artist: song.artist,
    albumArt: song.albumArt,
    previewUrl: song.preview,
    duration: song.duration,
    seed: null,
    provider: "deezer",
  }));
}

function transactionClient(options?: {
  status?: string;
  existingSongs?: ReturnType<typeof storedSongs>;
  players?: Array<{ songs: ReturnType<typeof storedSongs> }>;
  lockResult?: Array<{ id: string }>;
}) {
  const existingSongs = options?.existingSongs ?? [];
  const tx = {
    $queryRaw: vi.fn().mockResolvedValue(options?.lockResult ?? [{ id: room.id }]),
    room: {
      findUnique: vi.fn().mockResolvedValue({
        ...room,
        status: options?.status ?? room.status,
      }),
      update: vi.fn().mockResolvedValue(undefined),
    },
    player: {
      findUnique: vi.fn().mockResolvedValue({
        id: user.userId,
        roomId: room.id,
        name: user.name,
        role: user.role,
        connected: true,
        lastSeenAt: new Date(),
        songs: existingSongs,
      }),
      findMany: vi.fn().mockResolvedValue(
        options?.players ?? [
          { songs: storedSongs("player-a") },
          { songs: [] },
        ],
      ),
    },
    song: {
      create: vi.fn().mockImplementation(({ data }) =>
        Promise.resolve({
          id: `${data.playerId}-${data.deezerId}`,
          ...data,
          previewUrl: data.previewUrl,
          provider: "deezer",
        }),
      ),
    },
  };

  mocks.transaction.mockImplementation(
    (callback: (client: typeof tx) => unknown) => callback(tx),
  );
  return tx;
}

describe("submitPicks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("locks the room and atomically stores a first player's eight songs", async () => {
    const tx = transactionClient();

    const result = await submitPicks(submission(), user, room.code);

    const query = tx.$queryRaw.mock.calls[0]?.[0].join("");
    expect(query).toContain('SELECT "id" FROM "Room"');
    expect(query).toContain("FOR UPDATE");
    expect(tx.song.create).toHaveBeenCalledTimes(8);
    expect(result.newSongs).toHaveLength(8);
    expect(result.bothPlayersReady).toBe(false);
    expect(mocks.seedSongs).not.toHaveBeenCalled();
    expect(tx.room.update).not.toHaveBeenCalled();
  });

  it("returns an existing complete submission without creating duplicates", async () => {
    const existingSongs = storedSongs();
    const tx = transactionClient({ existingSongs });

    const result = await submitPicks(submission(), user, room.code);

    expect(result).toEqual({ newSongs: existingSongs, bothPlayersReady: false });
    expect(tx.song.create).not.toHaveBeenCalled();
    expect(tx.player.findMany).not.toHaveBeenCalled();
  });

  it("reports readiness when retrying after the room entered battling", async () => {
    const existingSongs = storedSongs();
    const tx = transactionClient({ status: "battling", existingSongs });

    const result = await submitPicks(submission(), user, room.code);

    expect(result).toEqual({ newSongs: existingSongs, bothPlayersReady: true });
    expect(tx.song.create).not.toHaveBeenCalled();
  });

  it("seeds the bracket and advances the room when both players are ready", async () => {
    const tx = transactionClient({
      players: [
        { songs: storedSongs("player-a") },
        { songs: storedSongs("player-b") },
      ],
    });

    const result = await submitPicks(submission(), user, room.code);

    expect(result.bothPlayersReady).toBe(true);
    expect(mocks.seedSongs).toHaveBeenCalledWith(room.code, room.id, tx);
    expect(tx.room.update).toHaveBeenCalledWith({
      data: { status: "battling" },
      where: { id: room.id },
    });
  });

  it("rejects a partial prior submission instead of adding more songs", async () => {
    const tx = transactionClient({ existingSongs: storedSongs().slice(0, 3) });

    await expect(submitPicks(submission(), user, room.code)).rejects.toThrow(
      "incomplete submission (3/8 songs)",
    );
    expect(tx.song.create).not.toHaveBeenCalled();
    expect(mocks.seedSongs).not.toHaveBeenCalled();
  });

  it("does not advance the room when bracket seeding fails", async () => {
    const tx = transactionClient({
      players: [
        { songs: storedSongs("player-a") },
        { songs: storedSongs("player-b") },
      ],
    });
    mocks.seedSongs.mockRejectedValueOnce(new Error("seed failed"));

    await expect(submitPicks(submission(), user, room.code)).rejects.toThrow(
      "seed failed",
    );
    expect(tx.room.update).not.toHaveBeenCalled();
  });

  it("rejects when the room row cannot be locked", async () => {
    const tx = transactionClient({ lockResult: [] });

    await expect(submitPicks(submission(), user, room.code)).rejects.toThrow(
      `Cannot find room with id: ${room.id}`,
    );
    expect(tx.room.findUnique).not.toHaveBeenCalled();
    expect(tx.song.create).not.toHaveBeenCalled();
  });
});
