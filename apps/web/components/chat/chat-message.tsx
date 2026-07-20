"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Pencil, RotateCcw, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownRenderer } from "./markdown-renderer";
import { TypingIndicator } from "./typing-indicator";
import type { ChatMessage as ChatMessageType } from "@/types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
  onEdit?: (id: string, content: string) => void;
  onRegenerate?: (id: string) => void;
}

export function ChatMessage({ message, onEdit, onRegenerate }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const isUser = message.role === "user";
  const isEmptyStreaming = message.status === "streaming" && message.content.length === 0;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveEdit = () => {
    onEdit?.(message.id, draft);
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("group flex gap-3 px-4 py-4 sm:px-6", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-accent/10 text-accent",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      <div className={cn("flex max-w-[85%] flex-col gap-1.5 sm:max-w-[70%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser ? "bg-primary text-primary-foreground" : "border border-border bg-card",
          )}
        >
          {isEmptyStreaming ? (
            <TypingIndicator />
          ) : editing ? (
            <div className="flex min-w-[16rem] flex-col gap-2">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="min-h-[80px] border-transparent bg-transparent p-0 text-primary-foreground focus-visible:ring-0"
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="accent" onClick={handleSaveEdit}>
                  Save &amp; resend
                </Button>
              </div>
            </div>
          ) : isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {!editing && !isEmptyStreaming && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            {isUser && onEdit && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(true)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {!isUser && onRegenerate && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRegenerate(message.id)}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
