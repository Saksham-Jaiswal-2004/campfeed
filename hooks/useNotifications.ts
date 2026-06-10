import { useEffect } from "react";
import { getUserNotifications } from "@/services/notification.service";
import { useNotificationStore } from "@/store/notificationStore";
import { useUser } from "@/context/userContext";

export const useNotifications = () => {
  const { user }: any = useUser();
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  useEffect(() => {
    const load = async () => {
      try {
        const notifications = await getUserNotifications(user?.uid);
        setNotifications(notifications);
      } catch (err) {
        console.error("User notification fetch error: ", err);
      }
    };

    load();
  }, [setNotifications]);
};
