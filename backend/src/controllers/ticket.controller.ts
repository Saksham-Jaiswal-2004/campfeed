import { Request, Response } from "express";
import { db } from "../config/firebaseAdmin.js";
import {
  createRSVPAndTicket,
  deleteRSVPAndTicket,
  generateAndSendTicket,
} from "../services/ticket.service.js";

export const rsvpToEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId is required",
      });
    }

    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { ticketId, token, rsvpId } = await createRSVPAndTicket({
      eventId,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name || "Student",
      },
    });

    const eventSnap = await db.collection("events").doc(eventId).get();

    if (!eventSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const event = eventSnap.data() as any;

    generateAndSendTicket({
      ticketId,
      token,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
      },
      event: {
        id: eventId,
        name: event.name,
        venue: event.venue,
        startDate: event.startDate,
      },
    }).catch((err) => {
      console.error("Ticket pipeline failed:", err);
    });

    return res.status(200).json({
      success: true,
      message: "RSVP successful. Ticket is being generated.",
      data: {
        rsvpId,
        ticketId,
        eventId,
      },
    });
  } catch (error: any) {
    console.error("RSVP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const unRsvpFromEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId is required",
      });
    }

    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { deletedTicketId, deletedRsvpId } = await deleteRSVPAndTicket({
      eventId,
      user: {
        uid: user.uid,
      },
    });

    const eventRef = db.collection("events").doc(eventId);

    await db.runTransaction(async (tx) => {
      const eventSnap = await tx.get(eventRef);

      if (!eventSnap.exists) {
        return res.status(400).json({
          success: false,
          message: "Event Not Found",
        });
      }

      const data = eventSnap.data();

      tx.update(eventRef, {
        registered: Math.max((data?.registered || 1) - 1, 0),
      });
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error("Un-RSVP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getMyTickets = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const snapshot = await db
      .collection("tickets")
      .where("userId", "==", user.uid)
      .get();

    const tickets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error: any) {
    console.error("Fetch Tickets Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
};

export const verifyTicket = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    const user = (req as any).user;

    if (!user || user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { verifyTicketToken } = await import("../utils/token.js");

    const decoded = verifyTicketToken(token);

    console.log("Decode: ", decoded);

    const ticketRef = db.collection("tickets").doc(decoded.ticketId);

    const ticketSnap = await ticketRef.get();

    if (!ticketSnap.exists) {
      return res.status(404).json({
        success: false,
        message: `Invalid ticket ${decoded.ticketId}`,
      });
    }

    const ticket = ticketSnap.data() as any;

    if (ticket.used) {
      return res.status(400).json({
        success: false,
        message: "Ticket already used",
      });
    }

    await ticketRef.update({
      used: true,
      usedAt: new Date(),
      verifiedBy: user.uid,
    });

    const rsvpQuery = await db
      .collection("rsvps")
      .where("ticketId", "==", decoded.ticketId)
      .limit(1)
      .get();

    if (!rsvpQuery.empty) {
      await rsvpQuery.docs[0].ref.update({
        status: "attended",
        checkedInAt: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket verified successfully",
      data: {
        ticketId: decoded.ticketId,
        eventId: decoded.eventId,
        userId: decoded.userId,
      },
    });
  } catch (error: any) {
    console.error("Verify Ticket Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Invalid ticket",
    });
  }
};
