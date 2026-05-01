import { z } from "zod";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const EnvSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3001),
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),
});

const env = EnvSchema.parse(process.env);
const allowedOrigins = env.ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string | undefined) {
  if (!origin) return true;
  return allowedOrigins.includes(origin);
}

export { env, allowedOrigins, isAllowedOrigin };
