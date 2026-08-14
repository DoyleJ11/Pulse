import type { Request } from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";

function clientIpKey(req: Request) {
  // Railway injects both values at runtime. Only trust X-Real-IP when the
  // process is actually running inside Railway; local clients cannot choose
  // their own limiter key by spoofing that header.
  const railwayIp = process.env.RAILWAY_ENVIRONMENT_ID
    ? req.get("x-real-ip")
    : undefined;
  const clientIp =
    railwayIp ?? req.ip ?? req.socket.remoteAddress ?? "unknown-client";

  return ipKeyGenerator(clientIp);
}

function createLimiter(limit: number, windowMs: number, message: string) {
  return rateLimit({
    windowMs,
    limit,
    keyGenerator: clientIpKey,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      status: 429,
      message,
    },
  });
}

const createRoomLimiter = createLimiter(
  10,
  15 * 60 * 1000,
  "Too many rooms created. Please wait and try again.",
);

const joinRoomLimiter = createLimiter(
  30,
  15 * 60 * 1000,
  "Too many join attempts. Please wait and try again.",
);

const searchLimiter = createLimiter(
  60,
  60 * 1000,
  "Too many searches. Please wait a moment and try again.",
);

export {
  clientIpKey,
  createLimiter,
  createRoomLimiter,
  joinRoomLimiter,
  searchLimiter,
};
