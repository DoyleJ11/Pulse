import { type Request, type Response, type NextFunction } from "express"
import { verifyToken, type Payload } from "../utils/authUtils.js";

declare global {
    namespace Express {
        interface Request {
            user: Payload;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer')) {
            return res.status(401).json({message: "No token provided or invalid format."})
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: "No token provided"})
        }

        const decoded = verifyToken(token);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
