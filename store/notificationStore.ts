import { create } from "zustand";
import { Notification } from "@/types/notification.types";

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  setNotifications: (n: Notification[]) => void;
  addNotification: (n: Notification) => void;
  markAsRead: (id: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),

  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      );

      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    }),

  clear: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}));
