import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { CustomError } from "./utils/customErrors.js";
import { router as roomRouter } from "./routes/rooms.js";
import { router as searchRouter } from "./routes/search.js";
import { router as bracketRouter } from "./routes/bracket.js";
import { env, isAllowedOrigin } from "./utils/config.js";
import { ZodError } from "zod";
import { initSocket } from "./utils/socket.js";
import http from "node:http";
import cors from "cors";

const app: Application = express();
const port = env.PORT;
const httpServer = http.createServer(app);
initSocket(httpServer);

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  }),
);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "online" });
});

app.use("/api/rooms", roomRouter);
app.use("/api/rooms", bracketRouter);
app.use("/api/search", searchRouter);

app.use("/api/search", searchRouter);

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

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
