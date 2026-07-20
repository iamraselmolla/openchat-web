"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./chat-message";
import { EmptyState } from "./empty-state";
import type { ChatMessage as ChatMessageType } from "@/types";

interface MessageListProps {
  messages: ChatMessageType[];
  onPickPrompt: (prompt: string) => void;
  onEdit?: (id: string, content: string) => void;
  onRegenerate?: (id: string) => void;
}

export function MessageList({ messages, onPickPrompt, onEdit, onRegenerate }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 200) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollButton(distanceFromBottom > 300);
  };

  if (messages.length === 0) {
    return <EmptyState onPick={onPickPrompt} />;
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="scrollbar-thin h-full overflow-y-auto"
      >
        <div className="mx-auto max-w-3xl pb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} onEdit={onEdit} onRegenerate={onRegenerate} />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          className="glass absolute bottom-4 left-1/2 h-9 w-9 -translate-x-1/2 rounded-full shadow-md"
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
