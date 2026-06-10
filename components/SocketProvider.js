"use client";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";

export default function SocketProvider({ children }) {
  useNotificationsSocket();
  useNotifications();

  return children;
}