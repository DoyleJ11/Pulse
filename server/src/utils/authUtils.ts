import { env } from "./config.js";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";

export interface Payload extends JwtPayload {
  userId: string;
  name: string;
  role: string;
  roomId: string;
}

function generateToken(payload: Payload) {
  const secret = env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "4h" });

  return token;
}

function verifyToken(token: string) {
  const secretKey: Secret = env.JWT_SECRET;
  return jwt.verify(token, secretKey) as Payload;
}

export { generateToken, verifyToken };
