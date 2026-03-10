import { createRoom, joinRoom } from "../services/roomService.js";
import express from "express";
import { z } from "zod";

const router = express.Router();

const NameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(12, "Name cannot exceed 12 characters");

const CodeSchema = z.string().trim().min(6, "Code must be 6 characters").max(6);

router.post("/", async (req, res) => {
  const name = NameSchema.parse(req.body.name);
  const { room, host, token } = await createRoom(name);
  const response = {
    code: room.code,
    username: host.name,
    role: host.role,
    jwt: token,
  };

  res.json(response);
});

router.post("/:code/join", async (req, res) => {
  const name = NameSchema.parse(req.body.name);
  const code = CodeSchema.parse(req.params.code);
  const { room, user, token } = await joinRoom(name, code);
  const response = {
    code: room.code,
    username: user.name,
    role: user.role,
    jwt: token,
  };
  res.json(response);
});

export { router };
