import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import { useEventStore } from "@/store/eventStore";

export const eventService = {
  async fetchEvents() {
    const res = await api("/events/all-events", "GET", undefined);

    useEventStore.getState().setEvents(res.data);
  },

  async fetchEventById(id: string) {
    try {
      useEventStore.getState().setLoading(true);
      useEventStore.getState().setSelectedEvent(null);

      const res = await api(`/events/${id}`, "GET", undefined);

      useEventStore.getState().setSelectedEvent(res.data);
    } catch (error) {
      throw error;
    } finally {
      useEventStore.getState().setLoading(false);
    }
  },

  async createEvent(data: any) {
    const res = await api("/events/create-event", "POST", data);
  },

  async editEvent(id: string, updates: any) {
    await api(`/events/${id}`, "PATCH", updates);

    socket.emit("event_edit", {id, updates});

    useEventStore.getState().updateEvent(id, updates);
  },

  async deleteEvent(id: string) {
    await api(`/events/${id}`, "DELETE", undefined);

    socket.emit("event_delete", id);

    useEventStore.getState().deleteEvent(id);
  },
};
