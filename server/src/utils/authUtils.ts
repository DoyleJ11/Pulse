import { env } from "./config.js";
import jwt, {
  TokenExpiredError,
  type JwtPayload,
  type Secret,
} from "jsonwebtoken";

const ROOM_SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

class SessionExpiredError extends Error {
  constructor() {
    super("Your room session has expired. Please join or create a new room.");
    this.name = "SessionExpiredError";
  }
}

export interface Payload extends JwtPayload {
  userId: string;
  name: string;
  role: string;
  roomId: string;
}

function generateToken(payload: Payload) {
  const secret = env.JWT_SECRET;
  const token = jwt.sign(payload, secret, {
    expiresIn: ROOM_SESSION_TTL_SECONDS,
    algorithm: "HS256",
  });

  return token;
}

function verifyToken(token: string) {
  const secretKey: Secret = env.JWT_SECRET;
  try {
    return jwt.verify(token, secretKey, { algorithms: ["HS256"] }) as Payload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new SessionExpiredError();
    }

    throw error;
  }
}

export {
  generateToken,
  verifyToken,
  ROOM_SESSION_TTL_SECONDS,
  SessionExpiredError,
};
