"use client";

import { useState, type KeyboardEvent } from "react";
import { ArrowUp, Paperclip, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ModelBadge } from "./model-badge";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { estimateTokens } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";

interface ChatInputProps {
  onSend: (content: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  externalValue?: string;
}

export function ChatInput({ onSend, onStop, isStreaming, externalValue }: ChatInputProps) {
  const [value, setValue] = useState(externalValue ?? "");
  const textareaRef = useAutoResizeTextarea(value);
  const model = useChatStore((s) => s.aiSettings.model);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-background/95 px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="glass flex flex-col gap-2 rounded-2xl border border-border p-2.5 shadow-sm focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/20">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Aria..."
            rows={1}
            className="max-h-[200px] min-h-[24px] border-none bg-transparent p-1.5 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Attach a file (UI only)">
                <Paperclip className="h-4 w-4" />
              </Button>
              <ModelBadge model={model} />
              <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                {estimateTokens(value)} tokens
              </span>
            </div>

            {isStreaming ? (
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={onStop} title="Stop generating">
                <Square className="h-3.5 w-3.5 fill-current" />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="accent"
                className="h-8 w-8 rounded-lg"
                disabled={!value.trim()}
                onClick={handleSend}
                title="Send message"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Aria can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
