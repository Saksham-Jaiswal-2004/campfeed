import { db } from "../config/firebaseAdmin.js";
import cacheKeys from "../redis/cacheKeys.js";
import { getCache, setCache, deleteCache } from "../redis/cacheService.js";

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
        await db.collection("events").add(req.body);

        await deleteCache(cacheKeys.events);

        return res.json({
            success: true,
        });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
}

export async function getEventById(req: any, res: any) {
    try {
        const { id } = req.params;

        const key = cacheKeys.event(id);

        const cached = await getCache<any>(key);

        if (cached) {
            return res.json({
                source: "redis",
                data: cached,
            });
        }

        const doc = await db.collection("events").doc(id).get();

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