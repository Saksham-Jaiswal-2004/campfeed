import 'dotenv/config'
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/socketServer.js";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://campfeed.vercel.app/"],
    methods: ["GET", "POST"],
  },
});

initializeSocket(io);

server.listen(3001, () => {
  console.log("Socket Server Running");
});
