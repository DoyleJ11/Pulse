import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const app: Application = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "online" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
