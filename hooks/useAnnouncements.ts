"use client";

import { useEffect } from "react";
import { useAnnouncementStore } from "@/store/announcementStore";

export const useAnnouncements = () => {
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
    // fetchAnnouncements();
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