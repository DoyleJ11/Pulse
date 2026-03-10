import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { CustomError } from "./utils/customErrors.js";
import { router as roomRouter } from "./routes/rooms.js";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { z, ZodError } from "zod";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const EnvSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3001),
});

const env = EnvSchema.parse(process.env);

const app: Application = express();
const port = env.PORT;

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "online" });
});

app.use("/api/rooms", roomRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.status).json({
      status: err.status || 500,
      message: err.message || "Internal server error",
    });
  } else if (err instanceof ZodError) {
    res.status(400).json({
      status: 400,
      issues: err.issues,
    });
  } else {
    console.error(err.stack);
    res.status(500).json({
      status: 500,
      message: "Internal server error. Try again.",
    });
    console.error(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export type PrismaTransactionalClient = Parameters<
  Parameters<PrismaClient["$transaction"]>[0]
>[0];

export { prisma, env };
