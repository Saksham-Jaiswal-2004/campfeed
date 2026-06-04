import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getIssueMessages(issueId: string) {
    const q = query(collection(db, "issueChats", issueId, "messages"), orderBy("createdAt", "asc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function saveMessage(message:any) {
    await addDoc(collection(db, "issueChats", message.id, "messages"), message);
}