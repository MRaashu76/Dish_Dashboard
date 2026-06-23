import express from "express";
import cors from "cors";
import "dotenv/config";
import dishRoutes from "./routes/dishRoutes.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
  })
);

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logger ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.on("finish", () => {
    const color =
      res.statusCode >= 500
        ? "\x1b[31m"
        : res.statusCode >= 400
        ? "\x1b[33m"
        : "\x1b[32m";
    console.log(
      `${color}[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode}\x1b[0m`
    );
  });
  next();
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/dishes", dishRoutes);

// ── Error handling ───────────────────────────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
