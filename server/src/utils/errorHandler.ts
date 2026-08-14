import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { ZodError } from "zod";
import { CustomError } from "./customErrors.js";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

const asyncHandler = (fn: AsyncHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof CustomError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message || "Internal server error",
    });
  } else if (err instanceof ZodError) {
    res.status(400).json({
      status: 400,
      issues: err.issues,
    });
  } else {
    console.error(err.stack);
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: "Internal server error. Try again.",
    });
  }
}

export { asyncHandler, errorHandler };
