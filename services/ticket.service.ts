import { api } from "@/lib/api";
import { useTicketStore } from "@/store/ticketStore";

export const ticketService = {
  async fetchMyTickets() {
    const store = useTicketStore.getState();

    try {
      const res = await api("/tickets/my-tickets", "GET", undefined);

      store.setTickets(res.data);
    } catch (err: any) {
      store.setError(err.message);

      throw err;
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
