"use client";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useUser } from "@/context/userContext";
import { useNotificationStore } from "@/store/notificationStore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useNotificationsSocket = () => {
  const { user }: any = useUser();

  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    const init = async () => {
      if (!user?.uid) {
        console.log("User Id Null!")
        return;
      }

      socket.emit("join_user_room", user?.uid);

      if (user?.role === "Admin") {
        socket.emit("join_role_room", "admin");
      }
    };

    init();

    socket.on("receive_notification", (notification) => {
      addNotification(notification);
    });

    return () => {
      socket.off("receive_notification");
    };
  }, [user, addNotification]);
};
