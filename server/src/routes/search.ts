import { trackSearch, type DeezerTrack } from "../services/musicService.js";
import express from "express";
import { z } from "zod";

const router = express.Router();

const querySchema = z
  .string()
  .trim()
  .min(1, "Song name is required")
  .max(32, "Song name cannot exceed 32 characters");

router.get("/", async (req, res) => {
  const query = querySchema.parse(req.query.q);
  const trackResults = await trackSearch(query);

  res.json(trackResults);
});

export { router };
