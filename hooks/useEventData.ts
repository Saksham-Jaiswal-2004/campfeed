"use client";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useEventStore } from "@/store/eventStore";
import { eventService } from "@/services/events.service";

export function useEventData(eventId: string) {
  const selectedEvent = useEventStore((s) => s.selectedEvent);
  const updateEvent = useEventStore((s) => s.updateEvent);

  useEffect(() => {
    socket.emit("join_event_room", eventId);

    socket.on("rsvp_update", ({ eventId, registered }) => {
      updateEvent(eventId, {registered,});
      eventService.fetchEvents();
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