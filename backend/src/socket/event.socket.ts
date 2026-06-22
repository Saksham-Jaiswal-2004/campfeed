import { Server, Socket }from "socket.io";

export function registerChatEvents(io: Server, socket: Socket) {

  socket.on("join_event_room",(eventId: string) => {
      socket.join(`event_${eventId}`);
  });

  socket.on("leave_event_room",(eventId: string) => {
      socket.leave(`event_${eventId}`);
  });

  socket.on("rsvp_changed", async (eventId: string, updatedCount: number) => {
      try {
          io.to(`event_${eventId}`).emit("rsvp_update", {eventId, registered: updatedCount});
        } catch (error) {
          console.error(error);
        }
  });
}