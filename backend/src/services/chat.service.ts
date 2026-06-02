import { db } from "../config/firebaseAdmin";
import { ChatMessage }from "../types/chat.types";

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