import { create } from "zustand";
import { Event } from "@/types/event.types";
import { persist } from "zustand/middleware";

interface EventStore {
  events: Event[];

  selectedEvent: Event | null;

  loading: boolean;

  error: string | null;

  setEvents: (events: Event[]) => void;

  addEvent: (event: Event) => void;

  updateEvent: (id: string, updatedFields: Partial<Event>) => void;

  deleteEvent: (id: string) => void;

  setSelectedEvent: (event: Event | null) => void;

  setLoading: (loading: boolean) => void;

  setError: (error: string | null) => void;

  clearEvents: () => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [],

      selectedEvent: null,

      loading: false,
      
      error: null,

      setEvents: (events) => set({ events }),

      addEvent: (event) =>
        set((state) => ({
          events: [event, ...state.events],
        })),

      updateEvent: (id, updatedFields) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id
              ? {
                  ...event,
                  ...updatedFields,
                }
              : event,
          ),

          selectedEvent:
            state.selectedEvent?.id === id
              ? {
                  ...state.selectedEvent,
                  ...updatedFields,
                }
              : state.selectedEvent,
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),

          selectedEvent:
            state.selectedEvent?.id === id ? null : state.selectedEvent,
        })),

      setSelectedEvent: (event) =>
        set({
          selectedEvent: event,
        }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      clearEvents: () =>
        set({
          events: [],
          selectedEvent: null,
          error: null,
        }),
    }),
    { name: "events-storage" },
  ),
);
