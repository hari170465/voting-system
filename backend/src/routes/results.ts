import { Router } from "express";
import { prisma } from "../prisma.ts";
import { asyncHandler } from "../errors.ts";


const router = Router();


router.get("/", asyncHandler(async (_req, res) => {
const results = await prisma.candidate.findMany({
select: { id: true, name: true, _count: { select: { votes: true } } },
orderBy: { name: "asc" }
});
res.json(results.map(r => ({ id: r.id, name: r.name, total: r._count.votes })));
}));


export default router;