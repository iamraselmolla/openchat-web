"use client";

import { PenLine } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function ChatIndexPage() {
  return (
    <EmptyState
      icon={PenLine}
      title="Pick a chat, or start a new one"
      description="Your conversations live in the sidebar. Select one to continue it, or start a fresh one."
    />
  );
}
