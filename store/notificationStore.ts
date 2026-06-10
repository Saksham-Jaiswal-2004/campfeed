import { create } from "zustand";
import { Notification } from "@/types/notification.types";
import { persist } from "zustand/middleware";

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  setNotifications: (n: Notification[]) => void;
  addNotification: (n: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        }),

      addNotification: (notification) =>
        set((state) => {
          const exists = state.notifications.some(
            (n) => n.id === notification.id,
          );

          if (exists) return state;

          return {
            notifications: [notification, ...state.notifications],
            unreadCount: notification.isRead
              ? state.unreadCount
              : state.unreadCount + 1,
          };
        }),

      markAsRead: (id) =>
        set((state) => {
          let changed = false;

          const notifications = state.notifications.map((n) => {
            if (n.id === id && !n.isRead) {
              changed = true;
              return { ...n, isRead: true };
            }
            return n;
          });

          return {
            notifications,
            unreadCount: changed ? state.unreadCount - 1 : state.unreadCount,
          };
        }),

      markAllAsRead: () =>
        set((state) => {
          const notifications = state.notifications.map((n) => {
            return { ...n, isRead: true };
          });

          return {
            notifications,
            unreadCount: 0,
          };
        }),

      clear: () =>
        set({
          notifications: [],
          unreadCount: 0,
        }),
    }),
    {
      name: "notifications-storage",
    },
  ),
);
