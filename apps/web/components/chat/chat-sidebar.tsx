"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";
import type { Chat } from "@/types";

function groupChats(chats: Chat[]) {
  const now = Date.now();
  const groups: Record<string, Chat[]> = { Today: [], Yesterday: [], "Previous 7 days": [], Older: [] };

  for (const chat of chats) {
    const ageDays = (now - new Date(chat.updatedAt).getTime()) / 86_400_000;
    if (ageDays < 1) groups.Today.push(chat);
    else if (ageDays < 2) groups.Yesterday.push(chat);
    else if (ageDays < 7) groups["Previous 7 days"].push(chat);
    else groups.Older.push(chat);
  }

  return groups;
}

interface ChatSidebarProps {
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onTogglePin: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
}

export function ChatSidebar({
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onTogglePin,
  onRenameChat,
}: ChatSidebarProps) {
  const chats = useChatStore((s) => s.chats);
  const [search, setSearch] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const router = useRouter();

  const filtered = useMemo(
    () => chats.filter((c) => c.title.toLowerCase().includes(search.toLowerCase())),
    [chats, search],
  );
  const pinned = filtered.filter((c) => c.pinned);
  const grouped = groupChats(filtered.filter((c) => !c.pinned));

  const startRename = (chat: Chat) => {
    setRenamingId(chat.id);
    setRenameDraft(chat.title);
  };

  const commitRename = (id: string) => {
    if (renameDraft.trim()) onRenameChat(id, renameDraft.trim());
    setRenamingId(null);
  };

  const renderChatRow = (chat: Chat) => (
    <div
      key={chat.id}
      className={cn(
        "group flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition-colors",
        activeChatId === chat.id ? "bg-accent/10 text-accent" : "hover:bg-muted",
      )}
    >
      <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />
      {renamingId === chat.id ? (
        <input
          autoFocus
          value={renameDraft}
          onChange={(e) => setRenameDraft(e.target.value)}
          onBlur={() => commitRename(chat.id)}
          onKeyDown={(e) => e.key === "Enter" && commitRename(chat.id)}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
      ) : (
        <button className="min-w-0 flex-1 truncate text-left" onClick={() => onSelectChat(chat.id)}>
          {chat.title}
        </button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onTogglePin(chat.id)}>
            {chat.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
            {chat.pinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => startRename(chat)}>
            <Pencil className="h-3.5 w-3.5" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem destructive onClick={() => onDeleteChat(chat.id)}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold tracking-tight">Aria</span>
      </div>

      <div className="px-3">
        <Button className="w-full justify-start gap-2" variant="outline" onClick={onNewChat}>
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats"
            className="h-9 pl-8 text-sm"
          />
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {pinned.length > 0 && (
          <div>
            <p className="mb-1 px-2.5 text-xs font-medium text-muted-foreground">Pinned</p>
            <div className="space-y-0.5">{pinned.map(renderChatRow)}</div>
          </div>
        )}
        {Object.entries(grouped).map(([label, items]) =>
          items.length > 0 ? (
            <div key={label}>
              <p className="mb-1 px-2.5 text-xs font-medium text-muted-foreground">{label}</p>
              <div className="space-y-0.5">{items.map(renderChatRow)}</div>
            </div>
          ) : null,
        )}
        {filtered.length === 0 && (
          <p className="px-2.5 py-8 text-center text-sm text-muted-foreground">No chats found.</p>
        )}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-xl px-2 py-1.5">
          <Link href="/settings" className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Settings className="h-4 w-4" />
          </Link>
          <button onClick={() => router.push("/profile")} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg p-1 text-left hover:bg-muted">
            <Avatar className="h-7 w-7">
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">Demo User</p>
              <p className="truncate text-[11px] text-muted-foreground">Free plan</p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
