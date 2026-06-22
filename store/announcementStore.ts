import { create } from "zustand";
import { Announcement } from "@/types/announcement.types";

interface AnnouncementStore {
  announcements: Announcement[];
  selectedAnnouncement: Announcement | null;

  loading: boolean;
  error: string | null;

  setAnnouncements: (announcements: Announcement[]) => void;

  addAnnouncement: (announcement: Announcement) => void;

  updateAnnouncement: (
    id: string,
    updatedFields: Partial<Announcement>,
  ) => void;

  deleteAnnouncement: (id: string) => void;

  setSelectedAnnouncement: (announcement: Announcement | null) => void;

  setLoading: (loading: boolean) => void;

  setError: (error: string | null) => void;

  clearAnnouncements: () => void;
}

export const useAnnouncementStore = create<AnnouncementStore>((set) => ({
  announcements: [],

  selectedAnnouncement: null,

  loading: false,

  error: null,

  setAnnouncements: (announcements) =>
    set({
      announcements,
    }),

  addAnnouncement: (announcement) =>
    set((state) => ({
      announcements: [announcement, ...state.announcements],
    })),

  updateAnnouncement: (id, updatedFields) =>
    set((state) => ({
      announcements: state.announcements.map((announcement) =>
        announcement.id === id
          ? {
              ...announcement,
              ...updatedFields,
            }
          : announcement,
      ),

      selectedAnnouncement:
        state.selectedAnnouncement?.id === id
          ? {
              ...state.selectedAnnouncement,
              ...updatedFields,
            }
          : state.selectedAnnouncement,
    })),

  deleteAnnouncement: (id) =>
    set((state) => ({
      announcements: state.announcements.filter(
        (announcement) => announcement.id !== id,
      ),

      selectedAnnouncement:
        state.selectedAnnouncement?.id === id
          ? null
          : state.selectedAnnouncement,
    })),

  setSelectedAnnouncement: (announcement) =>
    set({
      selectedAnnouncement: announcement,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  clearAnnouncements: () =>
    set({
      announcements: [],

      selectedAnnouncement: null,

      error: null,

      loading: false,
    }),
}));