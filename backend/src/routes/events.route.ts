import { Router } from "express";
import { getEvents, createEvent, getEventById } from "../controllers/event.controller.js";
import { firebaseAuth } from "../middleware/firebaseAuth.js";

const router = Router();

router.get("/all-events", firebaseAuth, getEvents);

router.post("/create-event", firebaseAuth, createEvent);

router.get('/:eventId', firebaseAuth, getEventById);

export default router;