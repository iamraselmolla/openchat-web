"use client";

import { useState } from "react";
import Link from "next/link";
import { Pin, PencilLine, Trash2, Check, X } from "lucide-react";

export function ChatListItem({ chat, active, onRename, onTogglePin, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(chat.title);

  const saveEdit = async () => {
    const title = draft.trim();
    setEditing(false);
    if (title && title !== chat.title) {
      await onRename(chat.id, title);
    } else {
      setDraft(chat.title);
    }
  };

  return (
    <div
      className={`group relative rounded-sm border px-3 py-2.5 transition-colors ${
        active ? "border-pen/30 bg-pen/[0.06]" : "border-transparent hover:bg-paper-dim"
      }`}
    >
      {editing ? (
        <div className="flex items-center gap-1.5">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") {
                setDraft(chat.title);
                setEditing(false);
              }
            }}
            className="w-full rounded-sm border border-pen/40 bg-paper px-2 py-1 text-sm text-ink outline-none"
          />
          <button onClick={saveEdit} className="text-sage" aria-label="Save title">
            <Check size={16} />
          </button>
          <button
            onClick={() => {
              setDraft(chat.title);
              setEditing(false);
            }}
            className="text-ink-soft"
            aria-label="Cancel rename"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <Link href={`/chat/${chat.id}`} className="block pr-16">
          <div className="flex items-center gap-1.5">
            {chat.pinned && <Pin size={12} className="shrink-0 fill-sage text-sage" />}
            <span className="truncate text-sm text-ink">{chat.title}</span>
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-ink-soft">
            {new Date(chat.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            {" · "}
            {chat.model}
          </div>
        </Link>
      )}

      {!editing && (
        <div className="absolute right-2 top-2.5 hidden gap-1 group-hover:flex">
          <button
            onClick={() => onTogglePin(chat.id, !chat.pinned)}
            className="rounded p-1 text-ink-soft hover:bg-paper hover:text-pen"
            aria-label={chat.pinned ? "Unpin chat" : "Pin chat"}
            title={chat.pinned ? "Unpin" : "Pin"}
          >
            <Pin size={13} className={chat.pinned ? "fill-current" : ""} />
          </button>
          <button
            onClick={() => setEditing(true)}
            className="rounded p-1 text-ink-soft hover:bg-paper hover:text-pen"
            aria-label="Rename chat"
            title="Rename"
          >
            <PencilLine size={13} />
          </button>
          <button
            onClick={() => onDelete(chat)}
            className="rounded p-1 text-ink-soft hover:bg-paper hover:text-rust"
            aria-label="Delete chat"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
