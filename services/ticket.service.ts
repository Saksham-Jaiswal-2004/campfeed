import { api } from "@/lib/api";
import { useTicketStore } from "@/store/ticketStore";

export const ticketService = {
  async fetchMyTickets(force = false) {
    const store = useTicketStore.getState();

    if (!force && store.tickets.length > 0) {
      return store.tickets;
    }

    try {
      store.setLoading(true);
      const res = await api("/tickets/my-tickets", "GET", undefined);

      store.setTickets(res.data);
    } catch (err: any) {
      store.setError(err.message);
      throw err;
    } finally {
      store.setLoading(false);
    }
  },

  async fetchTicketById(id: string) {
    const store = useTicketStore.getState();

    try {
      store.setLoading(true);

      store.setSelectedTicket(null);

      const res = await api(`/tickets/${id}`, "GET", undefined);

      store.setSelectedTicket(res.data);

      return res.data;
    } finally {
      store.setLoading(false);
    }
  },
};
