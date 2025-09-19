import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.ts";
import { signJwt } from "../auth.ts";
import { asyncHandler, HttpError } from "../errors.ts";


const router = Router();


const credsSchema = z.object({
email: z.string().email(),
password: z.string().min(6)
});


function cookieOptions() {
const isProd = process.env.NODE_ENV === "production";
return {
httpOnly: true,
secure: isProd,
sameSite: isProd ? "none" : ("lax" as const),
maxAge: 7 * 24 * 60 * 60 * 1000
};
}


router.post("/signup", asyncHandler(async (req, res) => {
const { email, password } = credsSchema.parse(req.body);
const existing = await prisma.user.findUnique({ where: { email } });
if (existing) throw new HttpError(409, "Email already registered");
const passwordHash = await bcrypt.hash(password, 10);
const user = await prisma.user.create({ data: { email, passwordHash, role: "USER" } });
const token = signJwt({ sub: user.id, role: user.role });
res.cookie("token", token, cookieOptions());
res.json({ id: user.id, email: user.email, role: user.role });
}));


router.post("/login", asyncHandler(async (req, res) => {
const { email, password } = credsSchema.parse(req.body);
const user = await prisma.user.findUnique({ where: { email } });
if (!user) throw new HttpError(401, "Invalid credentials");
const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) throw new HttpError(401, "Invalid credentials");
const token = signJwt({ sub: user.id, role: user.role });
res.cookie("token", token, cookieOptions());
res.json({ id: user.id, email: user.email, role: user.role });
}));


router.post("/logout", asyncHandler(async (_req, res) => {
// Clear cookie
res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
res.json({ ok: true });
}));


router.get("/me", asyncHandler(async (req, res) => {
const user = (req as any).user as { sub: string; role: "USER" | "ADMIN" } | undefined;
if (!user) return res.status(200).json({ user: null });
}));


export default router;