import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs
} from "firebase/firestore";

export const getEventsPage = async (cursor = null, pageSize = 3) => {
  const baseQuery = cursor
    ? query(
        collection(db, "events"),
        orderBy("createdAt", "desc"),
        startAfter(cursor),
        limit(pageSize)
      )
    : query(
        collection(db, "events"),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

  const snap = await getDocs(baseQuery);

  const data = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return {
    data,
    lastDoc: snap.docs[snap.docs.length - 1] || null,
    hasMore: snap.docs.length === pageSize
  };
};