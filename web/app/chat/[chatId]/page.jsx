"use client";

import { useParams } from "next/navigation";
import { Pin, AlertTriangle } from "lucide-react";
import { useChatThread } from "@/lib/use-chat-thread";
import { MessageThread } from "@/components/MessageThread";
import { Composer } from "@/components/Composer";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";

export default function ChatPage() {
  const { chatId } = useParams();
  const { chat, messages, loading, error, sending, send, editMessage, deleteMessage } =
    useChatThread(chatId);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-ink-soft">
        <Spinner className="h-5 w-5" />
      </div>
    );
  }

  if (error || !chat) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Couldn't open this chat"
        description={error || "It may have been deleted, or it belongs to someone else."}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-2 border-b border-rule px-6 py-3.5">
        {chat.pinned && <Pin size={13} className="fill-sage text-sage" />}
        <h1 className="truncate font-display text-lg text-ink">{chat.title}</h1>
        <span className="ml-auto shrink-0 rounded-full border border-rule px-2 py-0.5 font-mono text-[11px] text-ink-soft">
          {chat.model}
        </span>
      </header>

      <div className="min-h-0 flex-1">
        <MessageThread messages={messages} onEdit={editMessage} onDelete={deleteMessage} />
      </div>

      <Composer onSend={send} sending={sending} />
    </div>
  );
}
