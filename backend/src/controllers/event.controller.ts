import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebaseAdmin.js";
import cacheKeys from "../redis/cacheKeys.js";
import { getCache, setCache, deleteCache } from "../redis/cacheService.js";
import { getIO } from "../index.js";

export async function getEvents(req: any, res: any) {
  try {
    const cached = await getCache<any[]>(cacheKeys.events);

    if (cached) {
      return res.json({
        source: "redis",
        data: cached,
      });
    }

    const snapshot = await db.collection("events").get();

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await setCache(cacheKeys.events, events, 600);

    return res.json({
      source: "firestore",
      data: events,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createEvent(req: any, res: any) {
  try {
    const event = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("events").add(event);

    const doc = await docRef.get();

    const newEvent = { id: doc.id, ...doc.data() };

    getIO().emit("event_create", {event: newEvent});

    await setCache(cacheKeys.event(docRef.id), newEvent, 600);

    const listCache = await getCache<any[]>(cacheKeys.events);
    if (listCache) {
      await setCache(cacheKeys.events, [newEvent, ...listCache], 600);
    }

    return res.json({
      success: true,
      event: newEvent,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getEventById(req: any, res: any) {
  try {
    const { eventId } = req.params;

    const key = cacheKeys.event(eventId);

    const cached = await getCache<any>(key);

    if (cached) {
      return res.json({
        source: "redis",
        data: cached,
      });
    }

    const doc = await db.collection("events").doc(eventId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = {
      id: doc.id,
      ...doc.data(),
    };

    await setCache(key, event, 600);

    return res.json({
      source: "firestore",
      data: event,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteEvent(req: any, res: any) {
  try {
    const { eventId } = req.params;

    const docRef = db.collection("events").doc(eventId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    await docRef.delete();

    await deleteCache(cacheKeys.event(eventId));

    const listCache = await getCache<any[]>(cacheKeys.events);

    if (listCache) {
      const updatedList = listCache.filter((event) => event.id !== eventId);

      await setCache(cacheKeys.events, updatedList, 600);
    }

    return res.json({
      success: true,
      message: "Event deleted successfully",
      deletedId: eventId,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
