"use client";

import { useState } from "react";
import { PencilLine, Trash2, Check, X } from "lucide-react";

export function MessageBubble({ message, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const isUser = message.role === "user";
  const isError = message.status === "error";
  const isStreaming = message.status === "streaming";

  const save = async () => {
    const content = draft.trim();
    setEditing(false);
    if (content && content !== message.content) {
      await onEdit(message.id, content);
    } else {
      setDraft(message.content);
    }
  };

  return (
    <div className="group flex gap-3 px-6 py-3">
      <div
        className={`mt-1 w-[3px] shrink-0 self-stretch rounded-full ${
          isError ? "bg-rust" : isUser ? "bg-pen" : "bg-sage"
        }`}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
            {isUser ? "You" : "Assistant"}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-ink-soft">
              {new Date(message.createdAt).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
            {!editing && !isStreaming && (
              <div className="hidden gap-1 group-hover:flex">
                {isUser && (
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded p-0.5 text-ink-soft hover:text-pen"
                    aria-label="Edit message"
                    title="Edit"
                  >
                    <PencilLine size={13} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(message.id)}
                  className="rounded p-0.5 text-ink-soft hover:text-rust"
                  aria-label="Delete message"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        {editing ? (
          <div className="mt-1.5">
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={Math.min(8, Math.max(2, draft.split("\n").length))}
              className="w-full rounded-sm border border-pen/40 bg-paper px-2.5 py-2 text-[15px] text-ink outline-none"
            />
            <div className="mt-1.5 flex items-center gap-3">
              <button
                onClick={save}
                className="flex items-center gap-1 rounded-sm bg-pen px-2.5 py-1 text-xs font-medium text-paper hover:bg-pen-soft"
              >
                <Check size={12} /> Save
              </button>
              <button
                onClick={() => {
                  setDraft(message.content);
                  setEditing(false);
                }}
                className="flex items-center gap-1 text-xs text-ink-soft hover:text-ink"
              >
                <X size={12} /> Cancel
              </button>
              <span className="text-xs text-ink-soft">Saving clears everything after this message.</span>
            </div>
          </div>
        ) : (
          <p
            className={`mt-1 whitespace-pre-wrap text-[15px] leading-relaxed ${
              isError ? "text-rust" : "text-ink"
            }`}
          >
            {message.content}
            {isStreaming && <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-ink align-middle" />}
          </p>
        )}
      </div>
    </div>
  );
}
