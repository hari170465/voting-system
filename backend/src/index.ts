import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./prisma.ts";
import authRoutes from "./routes/auth.ts";
import candidateRoutes from "./routes/candidates.ts";
import voteRoutes from "./routes/vote.ts";
import resultsRoutes from "./routes/results.ts";
import { auth } from "./auth.ts";
import { HttpError } from "./errors.ts";
import chatRoutes from "./routes/chat.ts";

const app = express();
const FRONTEND = process.env.CORS_ORIGIN?.trim() || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204, // some browsers expect 204
  })
);

// extra safety: set headers yourself and short-circuit OPTIONS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
/** --- CORS: allow your frontend & handle preflight --- */
const allowed = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsConfig: cors.CorsOptions = {
  origin: allowed,                           // array of allowed origins
  credentials: true,                         // allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));          // respond to all preflights
/** ----------------------------------------------- */

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/chat", chatRoutes);

// /api/me (include hasVoted)
app.get("/api/me", auth(), async (req, res) => {
  const { sub: userId, role } = (req as any).user as { sub: string; role: "USER" | "ADMIN" };
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { vote: true } });
  res.json({ id: user?.id, email: user?.email, role, hasVoted: !!user?.vote });
});

// 404
app.use((_req, _res, next) => next(new HttpError(404, "Not found")));

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV !== "production") console.error(err);
  res.status(status).json({ error: message });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`API listening on :${port}`));
