"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { useChatStore } from "@/store/chat-store";
import { api } from "@/lib/api-client";
import type { Chat } from "@/types";

/** The "no chat selected" screen — creating the first message spins up a new chat. */
export default function NewChatPage() {
  const router = useRouter();
  const upsertChat = useChatStore((s) => s.upsertChat);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const startChat = async (content: string) => {
    setPendingPrompt(content);
    try {
      const chat = await api.post<Chat>("/chats", { title: content.slice(0, 48) });
      upsertChat(chat);
      // Message send is completed on the chat detail page once mounted.
      sessionStorage.setItem(`pending:${chat.id}`, content);
      router.push(`/chat/${chat.id}`);
    } catch {
      toast.error("Could not reach the API. Check that the backend is running.");
      setPendingPrompt(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <MessageList messages={[]} onPickPrompt={startChat} />
      <ChatInput onSend={startChat} onStop={() => {}} isStreaming={pendingPrompt !== null} />
    </div>
  );
}
