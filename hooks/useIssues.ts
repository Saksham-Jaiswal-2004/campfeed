import { useEffect } from "react";
import { socket } from "@/lib/socket";

import { useIssueStore } from "@/store/issueStore";

export const useIssues = () => {
  const {
    campusFeed,
    userIssues,
    adminIssues,
    selectedIssue,

    setSelectedIssue,

    loading,
    error,

    updateIssue,
    removeIssue,

    addRealtimeIssue,
    updateRealtimeIssue,
    removeRealtimeIssue,
  } = useIssueStore();

  useEffect(() => {
    socket.on("issue_created", addRealtimeIssue);
    socket.on("issue_upvote", ({ issue }) => {
      updateIssue(issue);
      updateRealtimeIssue(issue);
      setSelectedIssue(issue);
    });
    socket.on("issue_updated", ({ issue }) => {
      updateIssue(issue);
    });
    socket.on("issue_deleted", removeRealtimeIssue);

    return () => {
      socket.off("issue_created", addRealtimeIssue);
      socket.off("issue_updated", updateRealtimeIssue);
      socket.off("issue_deleted", removeRealtimeIssue);
    };
  }, [addRealtimeIssue, updateRealtimeIssue, removeRealtimeIssue]);

  return {
    campusFeed,
    userIssues,
    adminIssues,
    selectedIssue,

    loading,
    error,

    updateIssue,
    removeIssue,
  };
};