import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const app: Application = express();
const port = process.env.PORT;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const rooms = await prisma.room.findMany();

console.log(rooms);

app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "online" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
