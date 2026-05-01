import express from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { fetchBracket } from "../services/bracketService.js";

const router = express.Router();

const CodeSchema = z.string().trim().min(6, "Code must be 6 characters").max(6);

router.get("/:code/bracket", authMiddleware, asyncHandler(async (req, res) => {
    const code = CodeSchema.parse(req.params.code);
    const bracket = await fetchBracket(code, req.user);

    res.json(bracket);
}));

export { router }
