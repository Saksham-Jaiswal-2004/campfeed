import { Router } from "express";
import { getEvents, createEvent, getEventById, deleteEvent } from "../controllers/event.controller.js";
import { firebaseAuth } from "../middleware/firebaseAuth.js";
import { notAStudent } from "../middleware/notAStudent.js";

const router = Router();

router.get("/all-events", firebaseAuth, getEvents);

router.post("/create-event", notAStudent, createEvent);

router.get('/:eventId', firebaseAuth, getEventById);

router.delete('/:eventId', firebaseAuth, deleteEvent);

export default router;