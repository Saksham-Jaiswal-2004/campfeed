import { Router } from "express";
import { rsvpToEvent, getMyTickets, verifyTicket, } from "../controllers/ticket.controller.js";
import { firebaseAuth } from "../middleware/firebaseAuth.js";

const router = Router();

router.post("/rsvp", firebaseAuth, rsvpToEvent);

router.get("/my-tickets", firebaseAuth, getMyTickets);

router.post("/verify", firebaseAuth, verifyTicket);

export default router;
