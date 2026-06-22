"use client";
import { useEffect } from "react";
import { ticketService } from "@/services/ticket.service";
import { useTicketStore } from "@/store/ticketStore";

export function useTicketData(id: string) {
  const ticket = useTicketStore((s) => s.selectedTicket);

  const loading = useTicketStore((s) => s.loading);

  useEffect(() => {
    if (!id) return;

    ticketService.fetchTicketById(id);
  }, [id]);

  return {
    ticket,
    loading,
  };
}