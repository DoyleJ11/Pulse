import { env } from "./config.js";
import jwt from "jsonwebtoken";
import { type Payload } from "../middleware/auth.js";

function generateToken(payload: Payload) {
  const secret = env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  return token;
}

export { generateToken };
