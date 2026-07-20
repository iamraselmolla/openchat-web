import { useCallback, useRef } from "react";
import { useChatStore } from "@/store/chat-store";
import { API_URL, getToken } from "@/lib/api-client";
import type { ChatMessage } from "@/types";

/**
 * Drives a single AI turn: appends the optimistic user + placeholder assistant
 * messages, opens a streaming POST request to the NestJS SSE endpoint, and
 * feeds tokens into the Zustand store as they arrive.
 */
export function useStreamingChat(chatId: string) {
  const appendMessage = useChatStore((s) => s.appendMessage);
  const updateLastMessage = useChatStore((s) => s.updateLastMessage);
  const setStreaming = useChatStore((s) => s.setStreaming);
  const aiSettings = useChatStore((s) => s.aiSettings);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      const now = new Date().toISOString();
      const userMessage: ChatMessage = { id: `tmp-user-${Date.now()}`, chatId, role: "user", content, createdAt: now };
      const assistantMessage: ChatMessage = {
        id: `tmp-assistant-${Date.now()}`,
        chatId,
        role: "assistant",
        content: "",
        status: "streaming",
        createdAt: now,
      };
      appendMessage(chatId, userMessage);
      appendMessage(chatId, assistantMessage);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`${API_URL}/api/v1/chats/${chatId}/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken() ?? ""}`,
          },
          body: JSON.stringify({ content, ...aiSettings }),
          signal: controller.signal,
        });

        if (!res.body) throw new Error("Streaming is not supported by this response");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const raw of events) {
            const line = raw.replace(/^data:\s*/, "").trim();
            if (!line) continue;
            const payload = JSON.parse(line) as { token?: string; done?: boolean; error?: string };
            if (payload.token) updateLastMessage(chatId, payload.token);
            if (payload.error) throw new Error(payload.error);
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          updateLastMessage(chatId, "\n\n_The response was interrupted. Please retry._");
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [chatId, appendMessage, updateLastMessage, setStreaming, aiSettings],
  );

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { sendMessage, stopGeneration };
}
