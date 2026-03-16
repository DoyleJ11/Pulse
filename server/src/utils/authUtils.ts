import { env } from "./config.js";
import jwt from "jsonwebtoken";

interface Payload {
  userId: string;
  name: string;
  role: string;
  roomId: string;
}

function generateToken(payload: Payload) {
  const secret = env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  return token;
}

export { generateToken };
