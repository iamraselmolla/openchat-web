import { create } from "zustand";
import type { Chat, ChatMessage, AiSettings } from "@/types";

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  messages: Record<string, ChatMessage[]>;
  isStreaming: boolean;
  searchQuery: string;
  aiSettings: AiSettings;

  setChats: (chats: Chat[]) => void;
  upsertChat: (chat: Chat) => void;
  removeChat: (chatId: string) => void;
  setActiveChat: (chatId: string | null) => void;
  setMessages: (chatId: string, messages: ChatMessage[]) => void;
  appendMessage: (chatId: string, message: ChatMessage) => void;
  updateLastMessage: (chatId: string, contentDelta: string) => void;
  setStreaming: (streaming: boolean) => void;
  setSearchQuery: (query: string) => void;
  setAiSettings: (settings: Partial<AiSettings>) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,
  messages: {},
  isStreaming: false,
  searchQuery: "",
  aiSettings: { model: "llama-3.1-8b-instant", temperature: 0.7, maxTokens: 2048 },

  setChats: (chats) => set({ chats }),

  upsertChat: (chat) =>
    set((state) => {
      const exists = state.chats.some((c) => c.id === chat.id);
      const chats = exists ? state.chats.map((c) => (c.id === chat.id ? chat : c)) : [chat, ...state.chats];
      return { chats };
    }),

  removeChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== chatId),
      activeChatId: state.activeChatId === chatId ? null : state.activeChatId,
    })),

  setActiveChat: (chatId) => set({ activeChatId: chatId }),

  setMessages: (chatId, messages) =>
    set((state) => ({ messages: { ...state.messages, [chatId]: messages } })),

  appendMessage: (chatId, message) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: [...(state.messages[chatId] ?? []), message] },
    })),

  updateLastMessage: (chatId, contentDelta) =>
    set((state) => {
      const list = state.messages[chatId] ?? [];
      if (list.length === 0) return state;
      const last = list[list.length - 1];
      const updated = { ...last, content: last.content + contentDelta };
      return { messages: { ...state.messages, [chatId]: [...list.slice(0, -1), updated] } };
    }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setAiSettings: (settings) => set((state) => ({ aiSettings: { ...state.aiSettings, ...settings } })),
}));
