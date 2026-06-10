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
      if (!user?.uid) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      const trueUser = snap.data();

      console.log("True user:", trueUser);

      socket.emit("join_user_room", trueUser?.uid);

      if (trueUser?.role === "Admin") {
        socket.emit("join_role_room", "admin");
      }
    };

    init();

    socket.on("receive_notification", (notification) => {
      addNotification(notification);
      console.log("Notification: ", notification.title);
    });

    return () => {
      socket.off("receive_notification");
    };
  }, [user, addNotification]);
};
