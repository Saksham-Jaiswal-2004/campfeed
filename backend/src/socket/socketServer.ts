import { Server }from "socket.io";
import { registerChatEvents }from "./chat.socket";

export function initializeSocket(io: Server) {
  io.on("connection", (socket) => {
      console.log("Connected:", socket.id);
      
      registerChatEvents(io, socket);

      socket.on("disconnect", () => {
          console.log("Disconnected:", socket.id);
        });
    });
}