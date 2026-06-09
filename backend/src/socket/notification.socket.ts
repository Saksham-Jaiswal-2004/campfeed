import { Server, Socket } from "socket.io";

export function setupNotificationSocket(io: Server, socket: Socket) {
  socket.on("join_user_room", (userId: string) => {
    socket.join(`user_${userId}`);
  });

  socket.on("join_role_room", (role: string) => {
    socket.join(`role_${role}`);
  });

  socket.on("send_notification", ({ userId, notification }) => {
    io.to(`user_${userId}`).emit("receive_notification", notification);
  });
}
