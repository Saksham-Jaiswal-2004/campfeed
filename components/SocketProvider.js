"use client";
import { PresenceProvider } from "@/context/presenceContext";
import { useUser } from "@/context/userContext";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useEventData } from "@/hooks/useEventData";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { usePresence } from "@/hooks/usePresence";
// import { usePresenceListener } from "@/hooks/usePresenceListener";
import { useTicketData } from "@/hooks/useTicketData";
import { useTickets } from "@/hooks/useTickets";

export default function SocketProvider({ children }) {
  const {user} = useUser();

  useNotificationsSocket();
  useNotifications();
  useEventData();
  useAnnouncements();
  useTicketData();
  useTickets();
  usePresence(user?.uid);
  // usePresenceListener();

  return (
    <PresenceProvider>
      {children}
    </PresenceProvider>
  );
}