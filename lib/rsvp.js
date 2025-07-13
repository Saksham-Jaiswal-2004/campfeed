// lib/rsvp.js
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase"; // adjust if needed

// ✅ RSVP logic
export async function rsvpToEvent(eventId, userId) {
  const eventRef = doc(db, "events", eventId);
  const eventSnap = await getDoc(eventRef);

  if (!eventSnap.exists()) {
    throw new Error("Event not found");
  }

  const data = eventSnap.data();
  const rsvpedUsers = data.rsvpedUsers || [];

  if (rsvpedUsers.includes(userId)) {
    throw new Error("You have already RSVPed.");
  }

  await updateDoc(eventRef, {
    registered: (data.registered || 0) + 1,
    rsvpedUsers: arrayUnion(userId),
  });
}

// ✅ UN-RSVP logic
export async function unRsvpFromEvent(eventId, userId) {
  const eventRef = doc(db, "events", eventId);
  const eventSnap = await getDoc(eventRef);

  if (!eventSnap.exists()) {
    throw new Error("Event not found");
  }

  const data = eventSnap.data();
  const rsvpedUsers = data.rsvpedUsers || [];

  if (!rsvpedUsers.includes(userId)) {
    throw new Error("You haven't RSVPed.");
  }

  await updateDoc(eventRef, {
    registered: Math.max((data.registered || 1) - 1, 0),
    rsvpedUsers: arrayRemove(userId),
  });
}
