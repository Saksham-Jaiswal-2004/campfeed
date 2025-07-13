import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body?.message;

    if (!userMessage || typeof userMessage !== "string") {
      return new Response(JSON.stringify({ error: "Invalid or missing 'message' field." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const message = userMessage.trim().toLowerCase();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY in environment." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    // 🔎 Dynamic Firestore-based Context
    let contextData = "";

    // Check Events
    if (message.includes("event") || message.includes("happening") || message.includes("fun")) {
      const q = query(
        collection(db, "events"),
        where("date", ">=", todayStr),
        orderBy("date")
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const eventLines = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          eventLines.push(`• ${d.title} on ${d.date} at ${d.time} in ${d.location}`);
        });
        contextData += `📅 Upcoming Events at IIIT Kalyani:\n${eventLines.join("\n")}\n\n`;
      }
    }

    // Check Announcements
    if (message.includes("announcement") || message.includes("notice") || message.includes("update")) {
      const q = query(
        collection(db, "announcements"),
        where("timestamp", ">=", Timestamp.fromDate(new Date(now.setHours(0, 0, 0, 0)))),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const announcementLines = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          const ts = new Date(d.timestamp.toDate()).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          });
          announcementLines.push(`• ${d.title} (${ts})`);
        });
        contextData += `📣 Recent Announcements:\n${announcementLines.join("\n")}\n\n`;
      }
    }

    // Check Users (Basic support, like "who is [user]" or "profile of")
    if (message.includes("user") || message.includes("profile") || message.includes("student")) {
      const usersSnap = await getDocs(collection(db, "users"));
      if (!usersSnap.empty) {
        const names = [];
        usersSnap.forEach((doc) => {
          const user = doc.data();
          if (user?.name) names.push(`• ${user.name} (${user?.department || "Dept Unknown"})`);
        });
        contextData += `🧑‍🎓 Registered Users:\n${names.slice(0, 10).join("\n")}\n\n`;
      }
    }

    // 🤖 GEMINI FINAL PROMPT
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `
You are CampBot, the friendly AI assistant of CampFeed — a student platform to get daily updates about IIIT Kalyani campus life.

Respond casually like a helpful student buddy. Use emojis. Be short and helpful.

You have access to the following real-time context from the Firestore database:

${contextData || "No relevant context found for this message."}

Now answer this question by the user:
"${userMessage}"
              `,
            },
          ],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const text = result.response.text();

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Gemini + Firebase Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
