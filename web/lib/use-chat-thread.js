"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "./api";
import { streamChatReply } from "./stream";

export function useChatThread(chatId) {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const abortRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/chats/${chatId}`);
      setChat(data);
      setMessages(data.messages ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  const refreshMessages = useCallback(async () => {
    const data = await api.get(`/chats/${chatId}/messages`);
    setMessages(data);
  }, [chatId]);

  const send = useCallback(
    async (content, options = {}) => {
      if (!content.trim() || sending) return;
      setSending(true);
      setError(null);

      const userTempId = `temp-user-${Date.now()}`;
      const assistantTempId = `temp-assistant-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: userTempId, role: "user", content, createdAt: new Date().toISOString() },
        { id: assistantTempId, role: "assistant", content: "", status: "streaming", createdAt: new Date().toISOString() },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      await streamChatReply(
        chatId,
        { content, ...options },
        {
          signal: controller.signal,
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantTempId ? { ...m, content: m.content + token } : m)),
            );
          },
          onDone: async () => {
            setSending(false);
            await refreshMessages();
          },
          onError: (message) => {
            setSending(false);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantTempId ? { ...m, status: "error", content: message } : m,
              ),
            );
          },
        },
      );
    },
    [chatId, sending, refreshMessages],
  );

  const editMessage = useCallback(
    async (messageId, content) => {
      await api.patch(`/chats/${chatId}/messages/${messageId}`, { content });
      // Editing truncates everything after this message server-side, so
      // re-sync the whole thread rather than patching state locally.
      await refreshMessages();
    },
    [chatId, refreshMessages],
  );

  const deleteMessage = useCallback(
    async (messageId) => {
      await api.delete(`/chats/${chatId}/messages/${messageId}`);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    },
    [chatId],
  );

  return {
    chat,
    messages,
    loading,
    error,
    sending,
    send,
    editMessage,
    deleteMessage,
    reload: load,
  };
}
