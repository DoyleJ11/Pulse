import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { router as roomRouter } from "./routes/rooms.js";
import { router as searchRouter } from "./routes/search.js";
import { router as bracketRouter } from "./routes/bracket.js";
import { env, isAllowedOrigin } from "./utils/config.js";
import { initSocket } from "./utils/socket.js";
import { errorHandler } from "./utils/errorHandler.js";
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

app.use(errorHandler);

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
