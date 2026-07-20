export type MessageRole = "system" | "user" | "assistant";
export type MessageStatus = "pending" | "streaming" | "complete" | "error";

export interface ChatMessage {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  status?: MessageStatus;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  pinned: boolean;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatWithMessages extends Chat {
  messages: ChatMessage[];
}

export interface AiSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}
