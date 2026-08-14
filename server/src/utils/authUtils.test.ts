import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { env } from "./config.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  generateToken,
  ROOM_SESSION_TTL_SECONDS,
  SessionExpiredError,
  verifyToken,
  type Payload,
} from "./authUtils.js";

const payload: Payload = {
  userId: "user-1",
  name: "Test Player",
  role: "player_a",
  roomId: "room-1",
};

describe("room session tokens", () => {
  it("remain valid for seven days", () => {
    const token = generateToken(payload);
    const decoded = jwt.decode(token) as JwtPayload;

    expect(decoded.iat).toBeTypeOf("number");
    expect(decoded.exp).toBeTypeOf("number");
    expect(decoded.exp! - decoded.iat!).toBe(ROOM_SESSION_TTL_SECONDS);
  });

  it("round-trips a valid room session", () => {
    const decoded = verifyToken(generateToken(payload));

    expect(decoded).toMatchObject(payload);
  });

  it("classifies an expired token separately from an invalid token", () => {
    const expiredToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: -1,
      algorithm: "HS256",
    });

    expect(() => verifyToken(expiredToken)).toThrow(SessionExpiredError);
    expect(() => verifyToken("not-a-token")).not.toThrow(SessionExpiredError);
  });
});

describe("auth middleware session errors", () => {
  function responseSpies() {
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));

    return {
      response: { status } as unknown as Response,
      status,
      json,
    };
  }

  it("returns a distinct code for an expired session", () => {
    const expiredToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: -1,
      algorithm: "HS256",
    });
    const request = {
      headers: { authorization: `Bearer ${expiredToken}` },
    } as Request;
    const { response, status, json } = responseSpies();

    authMiddleware(request, response, vi.fn() as NextFunction);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({
      code: "SESSION_EXPIRED",
      message: "Your room session has expired. Please join or create a new room.",
    });
  });

  it("keeps malformed tokens on the generic invalid-session path", () => {
    const request = {
      headers: { authorization: "Bearer not-a-token" },
    } as Request;
    const { response, status, json } = responseSpies();

    authMiddleware(request, response, vi.fn() as NextFunction);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({
      code: "INVALID_SESSION",
      message: "Invalid session token.",
    });
  });
});
