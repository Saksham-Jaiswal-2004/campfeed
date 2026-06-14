import { Router } from "express";
import { rsvpToEvent, getMyTickets, verifyTicket, unRsvpFromEvent, } from "../controllers/ticket.controller.js";
import { firebaseAuth } from "../middleware/firebaseAuth.js";

const router = Router();

router.post("/rsvp", firebaseAuth, rsvpToEvent);

router.post("/unrsvp", firebaseAuth, unRsvpFromEvent);

router.get("/my-tickets", firebaseAuth, getMyTickets);

router.post("/verify", firebaseAuth, verifyTicket);

export default router;
