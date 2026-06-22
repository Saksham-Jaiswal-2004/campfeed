import {
    serverTimestamp,
} from "firebase/firestore";
import { createNotification } from "./notification.service";
import { api } from "@/lib/api";

export async function logIssue(data, user) {
    try {
        const response = await api("/issues/post-issue", "POST", data);
        const issueId = response.docId;

        const notification = {
            userId: user.uid,
            senderId: user.uid,
            senderName: 'SJ',
            type: "ISSUE_CREATED",
            title: "New Issue Created Successfully",
            message: `Your issue ${data.title} have been logged successfully`,
            isRead: false,
            entityId: issueId,
            createdAt: serverTimestamp(),
        };

        await createNotification(notification);

        return issueId;
    } catch (error) {
        console.log("Issue Error: ", error);
        throw error;
    }
}

export async function changeStatus(id, newStatus) {
    try {
        await api(`/issues/${id}/edit`, "PATCH", {status: newStatus});
    } catch (error) {
        throw error;
    }
}

export async function editIssue(id, payload, user) {
    try {
        await api(`/issues/${id}/edit`, "PATCH", payload);

        const notification = {
            userId: user.uid,
            senderId: user.uid,
            senderName: 'SJ',
            type: "ISSUE_UPDATED",
            title: "Issue Updated Successfully",
            message: `Your issue ${payload.title} have been updated successfully`,
            isRead: false,
            entityId: id,
            createdAt: serverTimestamp(),
        };

        await createNotification(notification);
    } catch (error) {
        throw error;
    }
}