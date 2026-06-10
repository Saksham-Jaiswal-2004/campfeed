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
  writeBatch,
} from "firebase/firestore";

import { Notification } from "@/types/notification.types";
import { socket } from "@/lib/socket";

const NOTIF_COLLECTION = "notifications";

export async function createNotification(data: Notification) {
  try {
    const docRef = await addDoc(collection(db, NOTIF_COLLECTION), data);
    const notification = {...data, id: docRef.id,};
    socket.emit("issue_created", notification);

    return docRef.id;
  } catch (error) {
    console.log("Notificatio + Socket error: ", error);
    throw error;
  }
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

export async function markAsReadDB(id: string) {
  await updateDoc(doc(db, NOTIF_COLLECTION, id), {
    isRead: true,
  });
}

export async function markAllAsReadDB(userId: string) {
  const q = query(collection(db, NOTIF_COLLECTION), where("userId", "==", userId), where("isRead", "==", false),);

  const snapshot = await getDocs(q);
  const batch = writeBatch(db);

  snapshot.docs.forEach((docSnap) => {
    batch.update(docSnap.ref, {isRead: true,});
  });

  await batch.commit();
}
