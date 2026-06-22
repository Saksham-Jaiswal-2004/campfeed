import { api } from "@/lib/api";
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
    const res = await api("/events", "POST", data);

    useEventStore.getState().addEvent(res.data);
  },

  async editEvent(id: string, updates: any) {
    await api(`/events/${id}`, "PATCH", updates);

    useEventStore.getState().updateEvent(id, updates);
  },

  async deleteEvent(id: string) {
    await api(`/events/${id}`, "DELETE", undefined);

    useEventStore.getState().deleteEvent(id);
  },
};
