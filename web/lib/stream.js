import { API_URL, getToken } from "./api";

/**
 * POSTs to /chats/:chatId/stream and reads the SSE response by hand, since
 * the browser's EventSource API can't send a POST body or an Authorization
 * header. Calls onToken(text) for each chunk, then onDone() or onError(msg).
 */
export async function streamChatReply(chatId, payload, { onToken, onDone, onError, signal }) {
  const token = getToken();

  let res;
  try {
    res = await fetch(`${API_URL}/chats/${chatId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    onError?.("Couldn't reach the server. Check your connection and try again.");
    return;
  }

  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => null);
    onError?.(data?.message ?? "The AI response failed. Please retry.");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const raw of events) {
      const line = raw.trim();
      if (!line.startsWith("data:")) continue;

      let payload;
      try {
        payload = JSON.parse(line.slice(5).trim());
      } catch {
        continue;
      }

      if (payload.token) onToken?.(payload.token);
      else if (payload.done) onDone?.();
      else if (payload.error) onError?.(payload.error);
    }
  }
}
