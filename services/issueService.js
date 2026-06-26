import { serverTimestamp } from "firebase/firestore";
import { createNotification } from "./notification.service";
import { api } from "@/lib/api";
import { useIssueStore } from "@/store/issueStore";

export async function getCampusIssues(force = false) {
  const { campusFeed, setLoading, setError, setCampusFeed } = useIssueStore.getState();

  if (!force && campusFeed.length > 0) {
      return campusFeed;
  }

  try {
    setLoading(true);
    setError(null);

    const response = await api("/issues/campus-feed", "GET");

    const issues = response.data;

    setCampusFeed(issues);

    return issues;
  } catch (error) {
    setError(error.message);
    throw error;
  } finally {
    setLoading(false);
  }
}

export async function getUserIssues(userId, force = false) {
  const { userIssues, setLoading, setError, setUserIssues } = useIssueStore.getState();

  if (!force && userIssues.length > 0) {
      return userIssues;
  }

  try {
    setLoading(true);

    const response = await api(`/issues/userIssues/${userId}`, "GET");

    const issues = response.data;

    setUserIssues(issues);

    return issues;
  } catch (error) {
    setError(error.message);
    throw error;
  } finally {
    setLoading(false);
  }
}

export async function getAdminIssues(force = false) {
  const { adminIssues, setLoading, setError, setAdminIssues } = useIssueStore.getState();

  if (!force && adminIssues.length > 0) {
      return adminIssues;
  }

  try {
    setLoading(true);

    const response = await api("/issues/admin", "GET");

    const issues = response.data;

    setAdminIssues(issues);

    return issues;
  } catch (error) {
    setError(error.message);
    throw error;
  } finally {
    setLoading(false);
  }
}

export async function getIssueById(issueId) {
  const { setLoading, setError, setSelectedIssue } = useIssueStore.getState();

  try {
    setLoading(true);

    const response = await api(`/issues/${issueId}`, "GET");

    const issue = response.data;

    setSelectedIssue(issue);

    return issue;
  } catch (error) {
    setError(error.message);

    throw error;
  } finally {
    setLoading(false);
  }
}

export async function logIssue(data, user) {
  const { setLoading, setError, addIssue } = useIssueStore.getState();

  try {
    setLoading(true);

    const response = await api("/issues/post-issue", "POST", data);

    const issue = response.data;

    addIssue(issue);

    const notification = {
      userId: user.uid,
      senderId: user.uid,
      senderName: "SJ",
      type: "ISSUE_CREATED",
      title: "New Issue Created Successfully",
      message: `Your issue "${data.title}" has been logged successfully`,
      isRead: false,
      entityId: issue._id,
      createdAt: serverTimestamp(),
    };

    await createNotification(notification);

    return issue;
  } catch (error) {
    setError(error.message);

    console.log("Issue Error:", error);

    throw error;
  } finally {
    setLoading(false);
  }
}

export async function changeStatus(id, newStatus) {
  const { setLoading, setError, updateIssue } = useIssueStore.getState();

  try {
    setLoading(true);

    const response = await api(`/issues/${id}/edit`, "PATCH", {
      status: newStatus,
    });

    const issue = response.data;

    updateIssue(issue);

    return issue;
  } catch (error) {
    setError(error.message);

    throw error;
  } finally {
    setLoading(false);
  }
}

export async function upvote(issueId) {
  const { setError } = useIssueStore.getState();
  
  try {
    const response = await api(`/issues/${issueId}/vote`, "PATCH");

    return response;
  } catch (error) {
    setError(error.message);

    throw error;
  }
}

export async function editIssue(id, payload, user) {
  const { setLoading, setError, updateIssue } = useIssueStore.getState();

  try {
    setLoading(true);

    const response = await api(`/issues/${id}/edit`, "PATCH", payload);

    const issue = response.data;

    updateIssue(issue);

    const notification = {
      userId: user.uid,
      senderId: user.uid,
      senderName: "SJ",
      type: "ISSUE_UPDATED",
      title: "Issue Updated Successfully",
      message: `Your issue "${payload.title}" has been updated successfully`,
      isRead: false,
      entityId: id,
      createdAt: serverTimestamp(),
    };

    await createNotification(notification);

    return issue;
  } catch (error) {
    setError(error.message);

    throw error;
  } finally {
    setLoading(false);
  }
}

export async function deleteIssue(issueId) {
  const { setLoading, setError, removeIssue } = useIssueStore.getState();

  try {
    setLoading(true);

    await api(`/issues/${issueId}/delete`, "DELETE");

    removeIssue(issueId);

    return issueId;
  } catch (error) {
    setError(error.message);

    throw error;
  } finally {
    setLoading(false);
  }
}