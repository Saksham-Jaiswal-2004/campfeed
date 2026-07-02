"use client";
import { PresenceProvider } from "@/context/presenceContext";
import { useUser } from "@/context/userContext";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useEventData } from "@/hooks/useEventData";
import { useIssues } from "@/hooks/useIssues";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { usePresence } from "@/hooks/usePresence";
import { useTicketData } from "@/hooks/useTicketData";
import { useTickets } from "@/hooks/useTickets";
import { TooltipProvider } from "./ui/tooltip";

export default function SocketProvider({ children }) {
  const {user} = useUser();

  useNotificationsSocket();
  useNotifications();
  useEventData();
  useAnnouncements();
  useIssues()
  useTicketData();
  useTickets();
  usePresence(user?.uid);

  return (
    <TooltipProvider>
      <PresenceProvider>
        {children}
      </PresenceProvider>
    </TooltipProvider>
  );
}