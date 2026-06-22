"use client";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useEventStore } from "@/store/eventStore";

export function useEventData(eventId: string) {
  const selectedEvent = useEventStore((s) => s.selectedEvent);
  const updateEvent = useEventStore((s) => s.updateEvent);

  useEffect(() => {
    socket.emit("join_event_room", eventId);

    socket.on("rsvp_update", ({ eventId, registered }) => {
      updateEvent(eventId, {registered,});
    });

    return () => {
      socket.emit("leave_event_room", eventId);
      socket.off("rsvp_update");
    };
  }, [eventId]);

  return {
    selectedEvent,
  };
}