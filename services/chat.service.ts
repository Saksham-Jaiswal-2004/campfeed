import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createNotification } from "./notification.service";
import { Notification } from "@/types/notification.types";
import { socket } from "@/lib/socket";
import { ChatMessage } from "@/types/chat.types";

export async function getIssueMessages(issueId: string) {
    const q = query(collection(db, "issueChats", issueId, "messages"), orderBy("createdAt", "asc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function sendMessage(message:any, user:any) {
    const currentTime = Date.now();
    
    const chatting:any = {
        issueId: message.issueId,
        senderId: user.uid,
        senderName: user.username,
        senderRole: user.role,
        content: message.note,
        createdAt: currentTime,
    };

    const docRef = await addDoc(collection(db, "issueChats", message.issueId, "messages"), chatting);

    const chat:ChatMessage = {
        id: docRef.id,
        issueId: message.issueId,
        senderId: user.uid,
        senderName: user.username,
        senderRole: user.role,
        content: message.note,
        createdAt: currentTime,
    };

     socket.emit("send_message", chat);

    const notification:Notification = {
        id: "",
        userId: user.uid,
        senderId: user.uid,
        senderName: 'SJ',
        type: "COMMENT",
        title: "New Message",
        message: `There's a new message in the issue ${message.issueId}`,
        isRead: false,
        entityId: docRef.id,
        createdAt: currentTime,
    };
    
    await createNotification(notification);
}