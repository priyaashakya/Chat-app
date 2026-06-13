import "dotenv/config";

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();
const server = http.createServer(app);

// Database connection
connectDB();

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Chat App Backend Running");
});

app.get("/api/status", (req, res) => {
  res.send("Server is live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Required for Vercel
export default app;
