"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { useChatStore } from "@/store/chat-store";
import { api } from "@/lib/api-client";
import type { Chat } from "@/types";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { chats, setChats, upsertChat, removeChat, activeChatId, setActiveChat } = useChatStore();

  const { data } = useQuery({
    queryKey: ["chats"],
    queryFn: () => api.get<Chat[]>("/chats"),
  });

  useEffect(() => {
    if (data) setChats(data);
  }, [data, setChats]);

  const handleNewChat = async () => {
    try {
      const chat = await api.post<Chat>("/chats", {});
      upsertChat(chat);
      router.push(`/chat/${chat.id}`);
    } catch {
      toast.error("Could not start a new chat. Is the API running?");
    }
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    router.push(`/chat/${id}`);
  };

  const handleDeleteChat = async (id: string) => {
    removeChat(id);
    if (activeChatId === id) router.push("/chat");
    try {
      await api.delete(`/chats/${id}`);
      toast.success("Chat deleted");
    } catch {
      toast.error("Could not delete the chat");
    }
  };

  const handleTogglePin = async (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;
    const updated = { ...chat, pinned: !chat.pinned };
    upsertChat(updated);
    try {
      await api.patch<Chat>(`/chats/${id}`, { pinned: updated.pinned });
    } catch {
      toast.error("Could not update the chat");
    }
  };

  const handleRenameChat = async (id: string, title: string) => {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;
    upsertChat({ ...chat, title });
    try {
      await api.patch<Chat>(`/chats/${id}`, { title });
    } catch {
      toast.error("Could not rename the chat");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onTogglePin={handleTogglePin}
        onRenameChat={handleRenameChat}
      />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
