"use client";

import { useEffect, useState } from "react";
import { rsvpToEvent, unRsvpFromEvent } from "@/lib/rsvp";
import { useUser } from "@/context/userContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RSVPButton({ eventId }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRsvped, setIsRsvped] = useState(false);

  // Fetch RSVP status on mount
  useEffect(() => {
    const checkRSVPStatus = async () => {
      if (!user) return;

      const eventRef = doc(db, "events", eventId);
      const eventSnap = await getDoc(eventRef);

      if (eventSnap.exists()) {
        const data = eventSnap.data();
        setIsRsvped(data.rsvpedUsers?.includes(user.uid));
      }
    };

    checkRSVPStatus();
  }, [user, eventId]);

  const handleClick = async () => {
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isRsvped) {
        await unRsvpFromEvent(eventId, user.uid);
        setIsRsvped(false);
      } else {
        await rsvpToEvent(eventId, user.uid);
        setIsRsvped(true);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="mt-0 w-full">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white btnText text-sm rounded-sm hover:bg-gradient-to-br disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : isRsvped
          ? "Un-RSVP"
          : "RSVP"}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}