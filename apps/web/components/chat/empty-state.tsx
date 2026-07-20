"use client";

import { motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";

const PROMPTS = [
  "Explain this codebase to a new engineer",
  "Draft a launch announcement for a new feature",
  "Compare two approaches to a system design problem",
  "Help me debug a failing test",
];

export function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-8 px-6 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <MessageSquarePlus className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">What are you working on?</h2>
        <p className="text-sm text-muted-foreground">Start a conversation, or try one of these.</p>
      </div>
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPick(prompt)}
            className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm transition-colors hover:border-accent/40 hover:bg-accent/5"
          >
            {prompt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
