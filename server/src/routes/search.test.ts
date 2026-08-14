import { once } from "node:events";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import express from "express";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const musicMocks = vi.hoisted(() => ({
  trackSearch: vi.fn(),
}));

vi.mock("../services/musicService.js", () => ({
  trackSearch: musicMocks.trackSearch,
}));

import { router } from "./search.js";
import { generateToken } from "../utils/authUtils.js";
import { CustomError } from "../utils/customErrors.js";
import { errorHandler } from "../utils/errorHandler.js";

describe("search route authentication", () => {
  const app = express();
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    app.use("/", router);
    app.use(errorHandler);
    server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    const { port } = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(async () => {
    server.close();
    await once(server, "close");
  });

  it("rejects anonymous searches before calling Deezer", async () => {
    const response = await fetch(`${baseUrl}?q=test`);

    expect(response.status).toBe(401);
    expect(musicMocks.trackSearch).not.toHaveBeenCalled();
  });

  it("allows an authenticated room participant to search", async () => {
    musicMocks.trackSearch.mockResolvedValueOnce([]);
    const token = generateToken({
      userId: "user-1",
      name: "Test Player",
      role: "player_a",
      roomId: "room-1",
    });
    const response = await fetch(`${baseUrl}?q=test`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
    expect(musicMocks.trackSearch).toHaveBeenCalledWith("test");
  });

  it("returns a JSON 502 when Deezer search fails", async () => {
    musicMocks.trackSearch.mockRejectedValueOnce(
      new CustomError(
        "Song search is temporarily unavailable. Please try again.",
        502,
      ),
    );
    const token = generateToken({
      userId: "user-1",
      name: "Test Player",
      role: "player_a",
      roomId: "room-1",
    });
    const response = await fetch(`${baseUrl}?q=test`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      status: 502,
      message: "Song search is temporarily unavailable. Please try again.",
    });
  });
});
