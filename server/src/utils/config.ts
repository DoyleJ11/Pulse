import { z, ZodError } from "zod";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const EnvSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3001),
});

const env = EnvSchema.parse(process.env);

export { env };
