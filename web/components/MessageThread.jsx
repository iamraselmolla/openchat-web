"use client";

import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { EmptyState } from "./EmptyState";

export function MessageThread({ messages, onEdit, onDelete }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, messages[messages.length - 1]?.content]);

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Nothing here yet"
        description="Send a message below to start the conversation."
      />
    );
  }

  return (
    <div className="scrollbar-thin h-full overflow-y-auto py-3">
      <div className="mx-auto max-w-3xl">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onEdit={onEdit} onDelete={onDelete} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
