import { once } from "node:events";
import type { AddressInfo } from "node:net";
import express, { type Request } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { clientIpKey, createLimiter } from "./rateLimits.js";

const originalRailwayEnvironmentId = process.env.RAILWAY_ENVIRONMENT_ID;

afterEach(() => {
  if (originalRailwayEnvironmentId === undefined) {
    delete process.env.RAILWAY_ENVIRONMENT_ID;
  } else {
    process.env.RAILWAY_ENVIRONMENT_ID = originalRailwayEnvironmentId;
  }
});

describe("clientIpKey", () => {
  function requestWith(options: { ip: string; railwayIp?: string }) {
    return {
      get: vi.fn((name: string) =>
        name.toLowerCase() === "x-real-ip" ? options.railwayIp : undefined,
      ),
      ip: options.ip,
      socket: { remoteAddress: options.ip },
    } as unknown as Request;
  }

  it("ignores spoofed Railway headers outside Railway", () => {
    delete process.env.RAILWAY_ENVIRONMENT_ID;
    const request = requestWith({
      ip: "127.0.0.1",
      railwayIp: "203.0.113.10",
    });

    expect(clientIpKey(request)).toBe("127.0.0.1");
  });

  it("uses Railway's injected client IP inside Railway", () => {
    process.env.RAILWAY_ENVIRONMENT_ID = "test-environment";
    const request = requestWith({
      ip: "127.0.0.1",
      railwayIp: "203.0.113.10",
    });

    expect(clientIpKey(request)).toBe("203.0.113.10");
  });
});

describe("rate limiter responses", () => {
  it("returns a structured 429 response and standard headers", async () => {
    const app = express();
    app.get(
      "/",
      createLimiter(2, 60_000, "Slow down."),
      (_request, response) => response.json({ ok: true }),
    );
    const server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    const { port } = server.address() as AddressInfo;
    const url = `http://127.0.0.1:${port}`;

    try {
      expect((await fetch(url)).status).toBe(200);
      expect((await fetch(url)).status).toBe(200);

      const limited = await fetch(url);
      expect(limited.status).toBe(429);
      expect(await limited.json()).toEqual({
        status: 429,
        message: "Slow down.",
      });
      expect(limited.headers.has("ratelimit")).toBe(true);
      expect(limited.headers.has("retry-after")).toBe(true);
    } finally {
      server.close();
      await once(server, "close");
    }
  });
});
