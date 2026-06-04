import { Server, Socket }from "socket.io";
import { saveMessage } from "../services/chat.service.js";
import { ChatMessage } from "../types/chat.types.js";

export function registerChatEvents(io: Server, socket: Socket) {

  socket.on("join_issue_room",(issueId: string) => {
      socket.join(`issue_${issueId}`);
      console.log(`${socket.id} joined issue_${issueId}`);
  });

  socket.on("leave_issue_room",(issueId: string) => {
    socket.leave(`issue_${issueId}`);
  });

  socket.on("send_message", async (message: ChatMessage) => {
    try {
        await saveMessage(message);
        io.to(`issue_${message.issueId}`).emit("receive_message", {...message, createdAt: Date.now()});
      } catch (error) {
        console.error(error);
      }
    });
}