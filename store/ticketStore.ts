// store/ticketStore.ts

import { create } from "zustand";
import { Ticket } from "@/types/ticket.type";

interface TicketStore {
  tickets: Ticket[];

  selectedTicket: Ticket | null;

  loading: boolean;

  error: string | null;

  setTickets: (tickets: Ticket[]) => void;

  addTicket: (ticket: Ticket) => void;

  updateTicket: (id: string, data: Partial<Ticket>) => void;

  deleteTicket: (id: string) => void;

  setSelectedTicket: (ticket: Ticket | null) => void;

  setLoading: (value: boolean) => void;

  setError: (error: string | null) => void;

  clearTickets: () => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [],

  selectedTicket: null,

  loading: false,

  error: null,

  setTickets: (tickets) =>
    set({
      tickets,
    }),

  addTicket: (ticket) =>
    set((state) => ({
      tickets: [ticket, ...state.tickets],
    })),

  updateTicket: (id, data) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.ticketId === id
          ? {
              ...ticket,
              ...data,
            }
          : ticket,
      ),

      selectedTicket:
        state.selectedTicket?.ticketId === id
          ? {
              ...state.selectedTicket,
              ...data,
            }
          : state.selectedTicket,
    })),

  deleteTicket: (id) =>
    set((state) => ({
      tickets: state.tickets.filter((ticket) => ticket.ticketId !== id),

      selectedTicket:
        state.selectedTicket?.ticketId === id ? null : state.selectedTicket,
    })),

  setSelectedTicket: (ticket) =>
    set({
      selectedTicket: ticket,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  clearTickets: () =>
    set({
      tickets: [],
      selectedTicket: null,
      loading: false,
      error: null,
    }),
}));