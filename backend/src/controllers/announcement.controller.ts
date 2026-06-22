import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebaseAdmin.js";
import cacheKeys from "../redis/cacheKeys.js";
import { getCache, setCache, deleteCache } from "../redis/cacheService.js";

export async function getAnnouncements(req: any, res: any) {
  try {
    const cached = await getCache<any[]>(cacheKeys.announcements);

    if (cached) {
      return res.json({
        source: "redis",
        data: cached,
      });
    }

    const snapshot = await db.collection("announcements").get();

    const announcements = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await setCache(cacheKeys.announcements, announcements, 600);

    return res.json({
      source: "firestore",
      data: announcements,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getAnnouncementById(req: any, res: any) {
  try {
    const { announcementId } = req.params;

    const key = cacheKeys.announcement(announcementId);

    const cached = await getCache<any>(key);

    if (cached) {
      return res.json({
        source: "redis",
        data: cached,
      });
    }

    const doc = await db.collection("announcements").doc(announcementId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    const announcement = {
      id: doc.id,
      ...doc.data(),
    };

    await setCache(key, announcement, 600);

    return res.json({
      source: "firestore",
      data: announcement,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createAnnouncement(req: any, res: any) {
  try {
    const announcement = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("announcements").add(announcement);

    const newAnnouncement = {id: docRef.id, ...announcement,};

    await setCache(cacheKeys.announcement(docRef.id), newAnnouncement, 600);

    const listCache = await getCache<any[]>(cacheKeys.announcements);
    if (listCache) {
      await setCache(cacheKeys.announcements, [newAnnouncement, ...listCache], 600);
    }

    return res.json({
      success: true,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function editAnnouncement(req: any, res: any) {
  try {
    const { announcementId } = req.params;

    const docRef = db.collection("announcements").doc(announcementId);

    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        error: "Announcement not found",
      });
    }

    await docRef.update({
      ...req.body,
      updatedAt: FieldValue.serverTimestamp(),
    });

    await Promise.all([
      deleteCache(cacheKeys.announcements),
      deleteCache(cacheKeys.announcement(announcementId)),
    ]);

    return res.json({
      success: true,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
    });
  }
}

export async function deleteAnnouncement(req: any, res: any) {
  try {
    const { announcementId } = req.params;

    const docRef = db.collection("announcements").doc(announcementId);

    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        error: "Announcement not found",
      });
    }

    await docRef.delete();

    await Promise.all([
      deleteCache(cacheKeys.announcements),
      deleteCache(cacheKeys.announcement(announcementId)),
    ]);

    return res.json({
      success: true,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
