import { create } from "zustand";

interface ChatStore {
  messages: any[];

  setMessages: (messages: any[]) => void;

  addMessage: (message: any) => void;

  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => {
      const exists = state.messages.some((n) => n.id === message.id);

      if (exists) return state;

      return { messages: [...state.messages, message] };
    }),

  clearMessages: () => set({ messages: [] }),
}));
