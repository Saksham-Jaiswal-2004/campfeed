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

  addMessage: (message) => set((state) => ({messages: [...state.messages, message], })),

  clearMessages: () => set({messages: [],}),
}));
