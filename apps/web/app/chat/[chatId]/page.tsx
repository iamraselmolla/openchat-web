"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { useChatStore } from "@/store/chat-store";
import { useStreamingChat } from "@/hooks/use-streaming-chat";
import { api } from "@/lib/api-client";
import type { ChatMessage, ChatWithMessages } from "@/types";

export default function ChatDetailPage() {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId;

  const setActiveChat = useChatStore((s) => s.setActiveChat);
  const setMessages = useChatStore((s) => s.setMessages);
  const messages = useChatStore((s) => s.messages[chatId] ?? []);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const { sendMessage, stopGeneration } = useStreamingChat(chatId);

  const { data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => api.get<ChatWithMessages>(`/chats/${chatId}`),
    enabled: Boolean(chatId),
  });

  useEffect(() => {
    setActiveChat(chatId);
  }, [chatId, setActiveChat]);

  useEffect(() => {
    if (data?.messages) setMessages(chatId, data.messages as ChatMessage[]);
  }, [data, chatId, setMessages]);

  // If this chat was just created from the "new chat" screen, fire off the first message.
  useEffect(() => {
    const pending = sessionStorage.getItem(`pending:${chatId}`);
    if (pending) {
      sessionStorage.removeItem(`pending:${chatId}`);
      sendMessage(pending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const handleEdit = (id: string, content: string) => {
    void id;
    sendMessage(content);
  };

  const handleRegenerate = (_id: string) => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) sendMessage(lastUser.content);
  };

  return (
    <div className="flex h-full flex-col">
      <MessageList
        messages={messages}
        onPickPrompt={sendMessage}
        onEdit={handleEdit}
        onRegenerate={handleRegenerate}
      />
      <ChatInput onSend={sendMessage} onStop={stopGeneration} isStreaming={isStreaming} />
    </div>
  );
}
