import { Server } from "socket.io";
import { registerChatEvents } from "./chat.socket.js";
import { setupNotificationSocket } from "./notification.socket.js";

export function initializeSocket(io: Server) {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // Show User Online
    socket.on("user-online", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.emit("online-users", Array.from(onlineUsers.keys()));
      io.emit("presence-update", { userId: userId, status: "online" });
    });

    // Show User Offline - Manual
    socket.on("user-offline", (userId) => {
      onlineUsers.delete(userId);
      io.emit("presence-update", { userId, status: "offline" });
    });

    registerChatEvents(io, socket);

    setupNotificationSocket(io, socket);

    socket.on("disconnect", () => {
      // Show User Offline - Automatic
      let disconnectedUserId = null;

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        io.emit("presence-update", { userId: disconnectedUserId, status: "offline" });
      }

      console.log("Disconnected:", socket.id);
    });
  });
}
