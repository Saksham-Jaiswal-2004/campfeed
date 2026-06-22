"use client";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useTicketStore } from "@/store/ticketStore";
import { ticketService } from "@/services/ticket.service"; 

export function useTickets() {
  const tickets = useTicketStore((s) => s.tickets);

  const loading = useTicketStore((s) => s.loading);

  useEffect(() => {
    ticketService.fetchMyTickets();

    socket.on("ticket_created", (ticket) => {
      useTicketStore.getState().addTicket(ticket);
    });

    socket.on("ticket_used", ({ ticketId }) => {
      useTicketStore.getState().updateTicket(ticketId, {
        used: true,
      });
    });

    socket.on("ticket_deleted", (ticketId) => {
      useTicketStore.getState().deleteTicket(ticketId);
    });

    return () => {
      socket.off("ticket_created");

      socket.off("ticket_used");

      socket.off("ticket_deleted");
    };
  }, []);

  return {
    tickets,
    loading,
  };
}
