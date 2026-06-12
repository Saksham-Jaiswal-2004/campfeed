import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/socketServer.js";
import { connectRedis } from "./redis/redisClient.js";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://campfeed.vercel.app/"],
    methods: ["GET", "POST"],
  },
});

// app.use(cors ({
//   origin: ["http://localhost:3000", "https://campfeed.vercel.app/"],
//   credentials: true,
// }));

initializeSocket(io);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  // await connectRedis();

  server.listen(3001, () => {
    console.log("Socket Server Running");
  });
}

start();
