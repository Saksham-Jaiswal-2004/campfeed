"use client";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useChatStore } from "@/store/chatStore";
import { getIssueMessages } from "@/services/chat.service";

export function useIssueChat(issueId: string) {
  const { messages, addMessage, setMessages } = useChatStore();

  useEffect(() => {
    async function initializeChat() {
      const existingMessages = await getIssueMessages(issueId);
      setMessages(existingMessages);
    }

    initializeChat();

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
