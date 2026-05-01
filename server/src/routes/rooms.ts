import {
  createRoom,
  getRoomState,
  joinRoom,
  submitPicks,
  setToPicking,
} from "../services/roomService.js";
import express from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { submissionComplete, startPicking } from "../sockets/roomEvents.js";

const router = express.Router();

const NameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(12, "Name cannot exceed 12 characters");

const CodeSchema = z.string().trim().min(6, "Code must be 6 characters").max(6);

const SongSchema = z.object({
  deezerId: z.string(),
  deezerRank: z.number(),
  title: z.string(),
  artist: z.string(),
  albumArt: z.string(),
  duration: z.number(),
  preview: z.string(),
});
export type Song = z.infer<typeof SongSchema>;

const SubmissionSchema = z
  .array(SongSchema)
  .length(8, { message: "Must submit exactly 8 songs." });

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const name = NameSchema.parse(req.body.name);
    const { room, host, token } = await createRoom(name);
    const response = {
      id: host.id,
      code: room.code,
      name: host.name,
      role: host.role,
      jwt: token,
    };

    res.json(response);
  }),
);

router.post(
  "/:code/join",
  asyncHandler(async (req, res) => {
    const name = NameSchema.parse(req.body.name);
    const code = CodeSchema.parse(req.params.code);
    const { room, user, token } = await joinRoom(name, code);
    const response = {
      id: user.id,
      code: room.code,
      name: user.name,
      role: user.role,
      jwt: token,
    };
    res.json(response);
  }),
);

router.get(
  "/:code/state",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const code = CodeSchema.parse(req.params.code);
    const roomState = await getRoomState(code, req.user);

    res.json(roomState);
  }),
);

router.post(
  "/:code/startPicking",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const code = CodeSchema.parse(req.params.code);
    const payload = req.user;
    const updatedRoom = await setToPicking(code, payload);

    const response = {
      status: updatedRoom.status,
    };

    startPicking(code, updatedRoom.status);
    res.json(response);
  }),
);

router.post(
  "/:code/picks",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const songs = SubmissionSchema.parse(req.body.songs);
    const payload = req.user;
    const code = CodeSchema.parse(req.params.code);
    const { newSongs, bothPlayersReady } = await submitPicks(
      songs,
      payload,
      code,
    );

    if (bothPlayersReady) {
      submissionComplete(code);
    }

    res.json(newSongs);
  }),
);

export { router };
