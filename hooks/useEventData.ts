"use client";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useEventStore } from "@/store/eventStore";
import { eventService } from "@/services/events.service";

export function useEventData(eventId: string) {
  const selectedEvent = useEventStore((s) => s.selectedEvent);
  const updateEvent = useEventStore((s) => s.updateEvent);
  const addEvent = useEventStore((s) => s.addEvent);
  const deleteEvent = useEventStore((s) => s.deleteEvent);

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

  useEffect(() => {
    socket.on("event_create", ({event}) => {
      addEvent(event);
    });

    socket.on("event_edit", ({eventId, update}) => {
      updateEvent(eventId, update);
    });

    socket.on("event_delete", ({eventId}) => {
      deleteEvent(eventId);
    });

    return () => {
      socket.off("event_create");
      socket.off("event_edit");
      socket.off("event_delete");
    };
  }, []);

  return {
    selectedEvent,
  };
}