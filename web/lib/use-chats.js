"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

export function useChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(query ? `/chats?search=${encodeURIComponent(query)}` : "/chats");
      setChats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => load(search), search ? 250 : 0);
    return () => clearTimeout(handle);
  }, [search, load]);

  const createChat = useCallback(async (title) => {
    const chat = await api.post("/chats", title ? { title } : {});
    setChats((prev) => [chat, ...prev]);
    return chat;
  }, []);

  const renameChat = useCallback(async (id, title) => {
    const updated = await api.patch(`/chats/${id}`, { title });
    setChats((prev) => reorder(prev.map((c) => (c.id === id ? { ...c, ...updated } : c))));
    return updated;
  }, []);

  const togglePin = useCallback(async (id, pinned) => {
    const updated = await api.patch(`/chats/${id}`, { pinned });
    setChats((prev) => reorder(prev.map((c) => (c.id === id ? { ...c, ...updated } : c))));
    return updated;
  }, []);

  const deleteChat = useCallback(async (id) => {
    await api.delete(`/chats/${id}`);
    setChats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    chats,
    loading,
    error,
    search,
    setSearch,
    reload: () => load(search),
    createChat,
    renameChat,
    togglePin,
    deleteChat,
  };
}

function reorder(list) {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}
