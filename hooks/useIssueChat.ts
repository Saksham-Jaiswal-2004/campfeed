"use client";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useChatStore } from "@/store/chatStore";

export function useIssueChat(issueId: string) {
  const { messages, addMessage } = useChatStore();

  useEffect(() => {
    socket.emit("join_issue_room", issueId);

    socket.on("receive_message", (message) => {
      addMessage(message);
    });

    return () => {
      socket.emit("leave_issue_room", issueId);

      socket.off("receive_message");
    };
  }, [issueId]);

  return {
    messages,
  };
}