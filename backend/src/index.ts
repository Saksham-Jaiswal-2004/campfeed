import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/socketServer.js";
import ticketRoutes from "./routes/ticket.route.js";
import eventRoutes from "./routes/events.route.js";
import announcementRoutes from "./routes/announcements.route.js";
import issueRoutes from "./routes/issues.route.js";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://campfeed.vercel.app"],
    methods: ["GET", "POST"],
  },
});

app.use("/api/tickets", ticketRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/issues", issueRoutes);

initializeSocket(io);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

server.listen(3001, () => {
  console.log("Socket Server Running");
});
