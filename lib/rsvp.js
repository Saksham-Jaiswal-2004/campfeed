import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase"; 

export async function rsvpToEvent(eventId, token) {

  console.log("EventId: ", eventId);
  console.log("Token: ", token);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/rsvp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    }
  );

  const data = await response.json();

  if (!response.status != 200) {
    throw new Error(data.message || "Failed to RSVP");
  }

  return data;
}

export async function unRsvpFromEvent(eventId, token) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/unrsvp`,
    {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    }
  );

  const data = await response.json();

  if (!response.status != 200) {
    throw new Error(data.message || "Failed to unRSVP");
  }

  return data;
}