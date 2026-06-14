import { db } from "../config/firebaseAdmin.js";
import crypto from "crypto";
import { generateTicketToken } from "../utils/token.js";
import { generateQRCode } from "./qr.service.js";
import { generateTicketPDF } from "./pdf.service.js";
import { sendTicketEmail } from "./email.service.js";

type RSVPRequest = {
  eventId: string;
  user: {
    uid: string;
    email: string;
    name?: string;
  };
};

type UnRSVPRequest = {
  eventId: string;
  user: {
    uid: string;
  };
};

export const createRSVPAndTicket = async ({ eventId, user }: RSVPRequest) => {
  const ticketId = crypto.randomUUID();

  const eventRef = db.collection("events").doc(eventId);
  const rsvpRef = db.collection("rsvps").doc();
  const ticketRef = db.collection("tickets").doc(ticketId);

  return await db.runTransaction(async (transaction) => {
    const eventSnap = await transaction.get(eventRef);

    if (!eventSnap.exists) {
      throw new Error("Event not found");
    }

    const event = eventSnap.data() as any;

    const existingRSVPQuery = db
      .collection("rsvps")
      .where("eventId", "==", eventId)
      .where("userId", "==", user.uid);

    const existingRSVP = await existingRSVPQuery.get();

    if (!existingRSVP.empty) {
      throw new Error("Already registered for this event");
    }

    if (!event.isUnlimited) {
      if ((event.registered || 0) >= event.capacity) {
        throw new Error("Event is full");
      }
    }

    const token = generateTicketToken({
      ticketId,
      eventId,
      userId: user.uid,
    });

    transaction.set(rsvpRef, {
      rsvpId: rsvpRef.id,
      eventId,
      userId: user.uid,
      status: "registered",
      registeredAt: new Date(),
      ticketId,
    });

    transaction.set(ticketRef, {
      ticketId,
      eventId,
      userId: user.uid,
      token,
      used: false,
      createdAt: new Date(),
    });

    transaction.update(eventRef, {
      registered: (event.registered || 0) + 1,
    });

    return {
      ticketId,
      token,
      rsvpId: rsvpRef.id,
    };
  });
};

export const deleteRSVPAndTicket = async ({ eventId, user }: UnRSVPRequest) => {
  const eventRef = db.collection("events").doc(eventId);

  return await db.runTransaction(async (transaction) => {
    const eventSnap = await transaction.get(eventRef);

    if (!eventSnap.exists) {
      throw new Error("Event not found");
    }

    const event = eventSnap.data() as any;

    const rsvpQuery = db
      .collection("rsvps")
      .where("eventId", "==", eventId)
      .where("userId", "==", user.uid)
      .limit(1);

    const rsvpSnap = await rsvpQuery.get();

    if (rsvpSnap.empty) {
      throw new Error("You have not RSVPed for this event");
    }

    const rsvpDoc = rsvpSnap.docs[0];
    const rsvpData = rsvpDoc.data();

    const ticketRef = db.collection("tickets").doc(rsvpData.ticketId);

    transaction.delete(rsvpDoc.ref);

    transaction.delete(ticketRef);

    const currentCount = event.currentRSVPs || 0;

    transaction.update(eventRef, {
      registered: Math.max(currentCount - 1, 0),
    });

    return {
      success: true,
      deletedRsvpId: rsvpDoc.id,
      deletedTicketId: rsvpData.ticketId,
    };
  });
};

export const generateAndSendTicket = async (data: {
  ticketId: string;
  token: string;
  user: {
    uid: string;
    email: string;
    name?: string;
  };
  event: {
    id: string;
    name: string;
    venue: string;
    startDate: any;
  };
}) => {
  const { ticketId, token, user, event } = data;

  const qrImage = await generateQRCode(token);

  const startDate =
    typeof event.startDate?.toDate === "function"
      ? event.startDate.toDate()
      : new Date(event.startDate);

  const pdfBuffer = await generateTicketPDF({
    eventName: event.name,
    venue: event.venue,
    date: startDate.toLocaleDateString("en-IN"),
    time: startDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    studentName: user.name || "Student",
    studentEmail: user.email,
    ticketId,
    qrImageBase64: qrImage,
  });

  await sendTicketEmail({
    to: user.email,
    studentName: user.name || "Student",
    eventName: event.name,
    pdfBuffer,
  });

  return {
    success: true,
  };
};
