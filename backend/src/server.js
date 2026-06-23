import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import socketHandler from "./socket/socketHandler.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// ── HTTP + Socket.io servers ─────────────────────────────────────────────────
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Make io accessible inside route handlers via req.app.get("io")
app.set("io", io);

// Register socket event handlers
socketHandler(io);

// ── Start ────────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

start();

// ── Graceful shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`\n⚠️  ${signal} received — shutting down gracefully…`);
  httpServer.close(async () => {
    console.log("🛑 HTTP server closed.");
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("💥 Unhandled rejection:", reason);
  shutdown("unhandledRejection");
});
