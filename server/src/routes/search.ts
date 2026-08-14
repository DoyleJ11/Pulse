import { trackSearch } from "../services/musicService.js";
import express from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
import { searchLimiter } from "../middleware/rateLimits.js";
import { asyncHandler } from "../utils/errorHandler.js";

const router = express.Router();

const querySchema = z
  .string()
  .trim()
  .min(1, "Song name is required")
  .max(32, "Song name cannot exceed 32 characters");

router.get(
  "/",
  searchLimiter,
  authMiddleware,
  asyncHandler(async (req, res) => {
    const query = querySchema.parse(req.query.q);
    const trackResults = await trackSearch(query);

    res.json(trackResults);
  }),
);

export { router };
