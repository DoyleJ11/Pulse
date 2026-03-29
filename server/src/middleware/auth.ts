import { type Request, type Response, type NextFunction } from "express"
import jwt, { type Secret, type JwtPayload } from "jsonwebtoken"
import { env } from "../utils/config.js";

declare global {
    namespace Express {
        interface Request {
            user: Payload;
        }
    }
}

export interface Payload extends JwtPayload {
    userId: string,
    name: string,
    role: string,
    roomId: string,
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

        const secretKey: Secret = env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey) as Payload;
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}