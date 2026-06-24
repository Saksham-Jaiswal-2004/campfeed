"use client";
import { useEffect } from "react";
import { useAnnouncementStore } from "@/store/announcementStore";
import { socket } from "@/lib/socket";

export const useAnnouncements = (announcementId: any) => {
  const {
    announcements,
    loading,
    error,
    // fetchAnnouncements,
    addAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
  } = useAnnouncementStore();

  useEffect(() => {
    socket.on("announcement_create", ({announcement}) => {
      console.log("Socket Data: ", announcement);
      addAnnouncement(announcement);
    });

    socket.on("announcement_edit", ({announcementId, update}) => {
      updateAnnouncement(announcementId, update);
    });

    socket.on("announcement_delete", ({announcementId}) => {
      deleteAnnouncement(announcementId);
    });

    return () => {
      socket.off("announcement_create");
      socket.off("announcement_edit");
      socket.off("announcement_delete");
    };
  }, []);

  return {
    announcements,
    loading,
    error,
    addAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
    // refresh: fetchAnnouncements,
  };
};
