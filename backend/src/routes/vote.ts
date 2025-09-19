import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.ts";
import { asyncHandler, HttpError } from "../errors.ts";
import { auth } from "../auth.ts";


const router = Router();


router.post("/", auth(), asyncHandler(async (req, res) => {
const { sub: userId } = (req as any).user as { sub: string };
const { candidateId } = z.object({ candidateId: z.string().uuid() }).parse(req.body);


const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
if (!candidate || !candidate.isActive) throw new HttpError(400, "Invalid candidate");


try {
const vote = await prisma.vote.create({ data: { userId, candidateId } });
res.status(201).json(vote);
} catch (e: any) {
// Prisma unique constraint code
if (e?.code === "P2002") throw new HttpError(409, "User has already voted");
throw e;
}
}));


export default router;