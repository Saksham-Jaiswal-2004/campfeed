"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useUser } from "@/context/userContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { socket } from "@/lib/socket";

export default function RSVPButton({ eventId, registered }) {
  const { user, token } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRsvped, setIsRsvped] = useState(false);

  useEffect(() => {
    const checkRSVPStatus = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "rsvps"),
          where("eventId", "==", eventId),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        setIsRsvped(!snapshot.empty);
      } catch (err) {
        console.error("Error checking RSVP:", err);
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
        const response = await api("/tickets/unrsvp", "POST", { eventId });
        setIsRsvped(false);
        socket.emit('rsvp_changed', {eventId, registered: registered+1})
      } else {
        const response = await api("/tickets/rsvp", "POST", { eventId })
        setIsRsvped(true);
        socket.emit('rsvp_changed', {eventId, registered: registered-1})
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-0 w-full">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white btnText text-sm rounded-sm hover:bg-gradient-to-br disabled:opacity-50"
      >
        {loading ? "Processing..." : isRsvped ? "Un-RSVP" : "RSVP"}
      </button>
    </div>
  );
}