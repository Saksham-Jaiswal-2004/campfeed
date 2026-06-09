import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";

import { Notification } from "@/types/notification.types";

const NOTIF_COLLECTION = "notifications";

export async function createNotification(data: Notification) {
  return await addDoc(collection(db, NOTIF_COLLECTION), data);
}

export async function getUserNotifications(userId: string) {
  const q = query(
    collection(db, NOTIF_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(30),
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Notification[];
}

export async function markAsRead(id: string) {
  await updateDoc(doc(db, NOTIF_COLLECTION, id), {
    isRead: true,
  });
}
