import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use environment variable in production
const EXPIRES_IN = "1d"; // Token expiration time

type ExpiresIn = "1d" | "1h"

export class JwtUtil {
    static generateToken(payload: object, expiresIn: ExpiresIn = EXPIRES_IN): string {
        return jwt.sign(payload, SECRET_KEY, { expiresIn });
    }

    static verifyToken(token: string): string | JwtPayload | null {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (error) {
            return null; // Invalid or expired token
        }
    }
}
