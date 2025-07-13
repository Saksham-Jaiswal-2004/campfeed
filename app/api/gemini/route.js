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
    const userMessage = body?.message?.trim();

    if (!userMessage || typeof userMessage !== "string") {
      return new Response(JSON.stringify({ error: "Invalid or missing 'message' field." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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
    const eventsList = [];
    const announcementsList = [];

    // 📅 EVENTS QUERY: Upcoming
    const eventQuery = query(
      collection(db, "events"),
      where("startDate", ">", Timestamp.fromDate(now)),
      orderBy("startDate", "asc")
    );

    const eventSnap = await getDocs(eventQuery);
    eventSnap.forEach(doc => {
      const data = doc.data();
      eventsList.push(
        `🎤 ${data.name} — ${new Date(data.startDate.toDate()).toLocaleDateString("en-IN")} at ${data.venue}\n🧠 Tags: ${data.tags?.join(", ") || "None"}\n📣 Organiser: ${data.organiser}\n📧 Contact: ${data.contactInfo}\n📃 Description: ${data.description}`
      );
    });

    // 📣 ANNOUNCEMENTS QUERY: Active/Upcoming
    const announceQuery = query(
      collection(db, "announcements"),
      where("expiryDate", ">", Timestamp.fromDate(now)),
      orderBy("expiryDate", "asc")
    );

    const announceSnap = await getDocs(announceQuery);
    announceSnap.forEach(doc => {
      const data = doc.data();
      announcementsList.push(
        `📢 ${data.title}\n📃 ${data.description}\n⏳ Expires: ${new Date(data.expiryDate.toDate()).toLocaleDateString("en-IN")}\n🏷️ Tags: ${data.tags?.join(", ") || "None"}\n🎯 Audience: ${data.targetAudience}`
      );
    });

    // 🧠 BUILD CONTEXT FOR GEMINI
    const contextText = `
You are CampBot — a smart AI assistant for CampFeed at IIIT Kalyani.
Always be friendly, helpful, and concise. Use emojis when needed.

Here is live campus data:

${eventsList.length > 0 ? `🔮 Upcoming Events:\n${eventsList.join("\n\n")}\n` : ""}
${announcementsList.length > 0 ? `📣 Current Announcements:\n${announcementsList.join("\n\n")}\n` : ""}

User asked: "${userMessage}"

Reply as a helpful college friend. Don't repeat the question. Mention real events/announcements when relevant.
`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: contextText }],
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