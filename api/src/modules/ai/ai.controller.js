const { prisma } = require("../../lib/prisma");
const redis = require("../../lib/redis");
const aiService = require("./ai.service");

/**
 * Server-Sent Events endpoint: persists the user message, streams the
 * assistant reply token-by-token, then persists the final assistant message.
 */
async function stream(req, res) {
  const { userId } = req.user;
  const { chatId } = req.params;
  const dto = req.body;

  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat || chat.userId !== userId) {
    return res.status(404).json({ message: "Chat not found" });
  }

  const allowed = await redis.checkRateLimit(`ai:rate:${userId}`, 20, 60);
  if (!allowed) {
    return res.status(429).json({ message: "Too many requests — please slow down." });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  await prisma.message.create({
    data: { chatId, role: "user", content: dto.content },
  });

  const history = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    select: { role: true, content: true },
  });

  let fullResponse = "";

  try {
    for await (const token of aiService.streamCompletion(history, {
      model: dto.model ?? chat.model,
      temperature: dto.temperature ?? 0.7,
      maxTokens: dto.maxTokens ?? 2048,
      systemPrompt: dto.systemPrompt,
    })) {
      fullResponse += token;
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }

    await prisma.message.create({
      data: { chatId, role: "assistant", content: fullResponse },
    });
    await prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });
    await redis.invalidate(`chats:list:${userId}`);

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: "The AI response failed. Please retry." })}\n\n`);
  } finally {
    res.end();
  }
}

module.exports = { stream };
