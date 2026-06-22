import { Server, Socket } from "socket.io";

export function setupNotificationSocket(io: Server, socket: Socket) {
  socket.on("join_user_room", (userId: string) => {
    socket.join(`user_${userId}`);
  });
  
  socket.on("join_role_room", (role: string) => {
    socket.join(`role_${role}`);
  });

  socket.on("issue_created", (data) => {
    io.to(`role_admin`).emit("receive_notification", data);
    io.to(`user_${data.senderId}`).emit("receive_notification", data);
  });

  socket.on("issue_updated", (data) => {
    io.to(`user_${data.senderId}`).emit("receive_notification", data);
  });

  socket.on("send_notification", ({ userId, notification }) => {
    io.to(`user_${userId}`).emit("receive_notification", notification);
  });
}
