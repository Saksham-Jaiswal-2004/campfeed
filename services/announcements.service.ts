import { api } from "@/lib/api";
import { useAnnouncementStore } from "@/store/announcementStore";

export const announcementService = {
  async fetchAnnouncements() {
    const store = useAnnouncementStore.getState();

    try {
      const res = await api("/announcements/all-announcements", "GET", undefined);

      store.setAnnouncements(res.data);

      return res.data;
    } catch (err: any) {
      store.setError(err.message);

      throw err;
    }
  },

  async fetchAnnouncementById(id: string) {
    const store = useAnnouncementStore.getState();

    try {
      store.setLoading(true);
      store.setSelectedAnnouncement(null);

      const res = await api(`/announcements/${id}`, "GET", undefined);

      store.setSelectedAnnouncement(res.data);

      return res.data;
    } catch (err: any) {
      store.setError(err.message);

      throw err;
    } finally {
      store.setLoading(false);
    }
  },

  async createAnnouncement(data: any) {
    const res = await api("/announcements/post-announcement", "POST", data);

    useAnnouncementStore.getState().addAnnouncement(res.data);

    return res.data;
  },

  async editAnnouncement(id: string, data: any) {
    await api(`/announcements/${id}/edit`, "PATCH", data);

    useAnnouncementStore.getState().updateAnnouncement(id, data);
  },

  async deleteAnnouncement(id: string) {
    await api(`/announcements/${id}/delete`, "DELETE", undefined);

    useAnnouncementStore.getState().deleteAnnouncement(id);
  },
};
