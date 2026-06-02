import { db } from "../config/firebaseAdmin.js";
import { ChatMessage } from "../types/chat.types.js";

export async function saveMessage(message: ChatMessage) {
  await db
    .collection("issueChats")
    .doc(message.issueId)
    .collection("messages")
    .add({
      ...message,
      createdAt: Date.now(),
    });
}