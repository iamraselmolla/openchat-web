"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Plus, Search, LogOut } from "lucide-react";
import { useChats } from "@/lib/use-chats";
import { useAuth } from "@/lib/auth-context";
import { ChatListItem } from "./ChatListItem";
import { ConfirmDialog } from "./ConfirmDialog";
import { Spinner } from "./Spinner";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { chats, loading, error, search, setSearch, createChat, renameChat, togglePin, deleteChat } =
    useChats();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [creating, setCreating] = useState(false);

  const activeId = pathname?.startsWith("/chat/") ? pathname.split("/")[2] : null;

  const handleNewChat = async () => {
    setCreating(true);
    try {
      const chat = await createChat();
      router.push(`/chat/${chat.id}`);
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    const chat = pendingDelete;
    setPendingDelete(null);
    await deleteChat(chat.id);
    if (activeId === chat.id) router.push("/chat");
  };

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-rule bg-paper-dim/40">
      <div className="flex items-center justify-between px-4 pt-5">
        <span className="font-display text-xl text-ink">Correspondence</span>
      </div>

      <div className="px-4 pt-4">
        <button
          onClick={handleNewChat}
          disabled={creating}
          className="flex w-full items-center justify-center gap-1.5 rounded-sm bg-pen px-3 py-2 text-sm font-medium text-paper transition-colors hover:bg-pen-soft disabled:opacity-60"
        >
          {creating ? <Spinner /> : <Plus size={15} />}
          New chat
        </button>
      </div>

      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-sm border border-rule bg-paper px-2.5 py-1.5">
          <Search size={14} className="text-ink-soft" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
          />
        </div>
      </div>

      <div className="scrollbar-thin mt-3 flex-1 space-y-1 overflow-y-auto px-2 pb-2">
        {loading && (
          <div className="flex items-center gap-2 px-3 py-4 text-sm text-ink-soft">
            <Spinner /> Loading chats…
          </div>
        )}
        {error && !loading && (
          <p className="px-3 py-4 text-sm text-rust">Couldn't load your chats — {error}</p>
        )}
        {!loading && !error && chats.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-ink-soft">
            No chats yet. Start one above.
          </p>
        )}
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            active={chat.id === activeId}
            onRename={renameChat}
            onTogglePin={togglePin}
            onDelete={setPendingDelete}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-rule px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-ink">{user?.name || user?.email}</p>
          {user?.name && <p className="truncate text-xs text-ink-soft">{user.email}</p>}
        </div>
        <button
          onClick={logout}
          className="rounded p-1.5 text-ink-soft hover:bg-paper hover:text-rust"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={16} />
        </button>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this chat?"
        description={pendingDelete ? `"${pendingDelete.title}" and all its messages will be removed for good.` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </aside>
  );
}
