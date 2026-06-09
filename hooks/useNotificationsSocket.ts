"use client"
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useUser } from "@/context/userContext";
import { useNotificationStore } from "@/store/notificationStore";

export const useNotificationsSocket = () => {
  const { user }:any = useUser();

  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    if (!user) return;

    socket.emit("join_user_room", user.uid);

    socket.on("receive_notification", (notification) => {
      addNotification(notification);
      console.log("Notification: ", notification.title);
    });

    return () => {
      socket.off("receive_notification");
    };
  }, [user]);
};
