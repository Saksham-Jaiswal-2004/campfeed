"use client";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";

export default function SocketProvider({ children }) {
  useNotificationsSocket();

  return children;
}