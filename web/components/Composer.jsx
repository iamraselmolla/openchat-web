"use client";

import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Spinner } from "./Spinner";

export function Composer({ onSend, sending }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const grow = (el) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const handleSubmit = async () => {
    const content = value.trim();
    if (!content || sending) return;
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await onSend(content);
  };

  return (
    <div className="border-t border-rule bg-paper px-6 py-4">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-sm border border-rule bg-paper px-3 py-2 focus-within:border-pen/50">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            grow(e.target);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          rows={1}
          placeholder="Write a message… (Enter to send, Shift+Enter for a new line)"
          className="max-h-[200px] w-full resize-none bg-transparent py-1 text-[15px] text-ink outline-none placeholder:text-ink-soft"
        />
        <button
          onClick={handleSubmit}
          disabled={sending || !value.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-pen text-paper transition-colors hover:bg-pen-soft disabled:opacity-40"
          aria-label="Send message"
        >
          {sending ? <Spinner /> : <ArrowUp size={16} />}
        </button>
      </div>
    </div>
  );
}
