import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "./errors.js";


export type JwtPayload = { sub: string; role: "USER" | "ADMIN" };


export function signJwt(payload: JwtPayload) {
const secret = process.env.JWT_SECRET!;
return jwt.sign(payload, secret, { expiresIn: "7d" });
}


export function verifyJwt(token: string): JwtPayload {
const secret = process.env.JWT_SECRET!;
return jwt.verify(token, secret) as JwtPayload;
}


export function auth(requiredRole?: "ADMIN" | "USER") {
return (req: Request, _res: Response, next: NextFunction) => {
const token = req.cookies?.token;
if (!token) throw new HttpError(401, "Not authenticated");
const payload = verifyJwt(token);
(req as any).user = payload;
if (requiredRole && payload.role !== requiredRole) {
throw new HttpError(403, "Forbidden");
}
next();
};
}