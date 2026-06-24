"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export const usePresence = (userId: any) => {
  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      socket.emit("user-online", userId);
    };

    socket.on("connect", handleConnect);

    if (socket.connected) {
      socket.emit("user-online", userId);
    }

    return () => {
      socket.emit("user-offline", userId);
      socket.off("connect", handleConnect);
      socket.disconnect();
    };
  }, [userId]);
};
