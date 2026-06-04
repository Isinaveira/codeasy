import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DevMode } from "./useCodeStore";
import { Message } from "../hooks/useAiAssistant";

export interface Conversation {
  id: string;
  title: string;
  mode: DevMode;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface ChatStore {
  conversations: Conversation[];
  activeId: string | null;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  clearActiveConversation: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      conversations: [],
      activeId: null,

      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
        })),

      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, ...updates, updatedAt: Date.now() } : conv
          ),
        })),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          activeId: state.activeId === id ? null : state.activeId,
        })),

      setActiveConversation: (id) =>
        set({
          activeId: id,
        }),

      clearActiveConversation: () =>
        set({
          activeId: null,
        }),
    }),
    {
      name: "codeasy-chat-storage",
    }
  )
);
