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
import { createNotification } from "./notification.service";

const serviceCollection = "issues";

export async function logIssue(data, user) {
    try {
        const docRef = await addDoc(collection(db, serviceCollection), data);

        const notification = {
            userId: user.uid,
            senderId: user.uid,
            senderName: 'SJ',
            type: "ISSUE_CREATED",
            title: "New Issue Created Successfully",
            message: `Your issue ${data.title} have been logged successfully`,
            isRead: false,
            entityId: docRef.id,
            createdAt: Date.now(),
        };

        await createNotification(notification);

        return docRef.id;
    } catch(error) {
        console.log("Issue Error: ", error);
        throw error;
    }
}