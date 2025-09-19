import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.ts";
import { asyncHandler } from "../errors.ts";
import { auth } from "../auth.ts";


const router = Router();


router.get("/", asyncHandler(async (_req, res) => {
const candidates = await prisma.candidate.findMany({
where: { isActive: true },
orderBy: { createdAt: "asc" }
});
res.json(candidates);
}));


// Admin sub-routes
const upsertSchema = z.object({
name: z.string().min(1),
manifesto: z.string().optional(),
isActive: z.boolean().optional()
});


router.get("/admin", auth("ADMIN"), asyncHandler(async (_req, res) => {
const candidates = await prisma.candidate.findMany({ orderBy: { createdAt: "asc" } });
res.json(candidates);
}));


router.post("/admin", auth("ADMIN"), asyncHandler(async (req, res) => {
const data = upsertSchema.parse(req.body);
const created = await prisma.candidate.create({ data });
res.status(201).json(created);
}));


router.put("/admin/:id", auth("ADMIN"), asyncHandler(async (req, res) => {
const id = req.params.id;
const data = upsertSchema.parse(req.body);
const updated = await prisma.candidate.update({ where: { id }, data });
res.json(updated);
}));


router.delete("/admin/:id", auth("ADMIN"), asyncHandler(async (req, res) => {
const id = req.params.id;
await prisma.candidate.delete({ where: { id } });
res.json({ ok: true });
}));


export default router;