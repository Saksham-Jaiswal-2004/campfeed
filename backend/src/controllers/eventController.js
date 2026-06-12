import firestore from "../config/firebase.js";
import cacheKeys from "../redis/cacheKeys.js";
import { getCache, setCache, deleteCache } from "../redis/cacheService.js";

export async function getEvents(req, res) {
    try {
        const cachedEvents = await getCache(
            cacheKeys.events
        );

        if (cachedEvents) {
            return res.status(200).json({
                source: "redis",
                data: cachedEvents,
            });
        }

        const snapshot = await firestore.collection("events").get();

        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), }));

        await setCache(cacheKeys.events, events, 600);

        return res.status(200).json({
            source: "firestore",
            data: events,
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
}

export async function createEvent(req, res) {
    try {
        await firestore.collection("events").add(req.body);

        await deleteCache(cacheKeys.events);

        return res.status(201).json({
            success: true,
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message,
        });

    }
}