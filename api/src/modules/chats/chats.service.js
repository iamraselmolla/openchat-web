const { prisma } = require("../../lib/prisma");
const redis = require("../../lib/redis");
const { NotFoundError, ForbiddenError } = require("../../lib/errors");

function listCacheKey(userId) {
  return `chats:list:${userId}`;
}

async function list(userId, search) {
  // Cache only the unfiltered list — search results are cheap enough to hit the DB directly.
  if (!search) {
    const cached = await redis.get(listCacheKey(userId));
    if (cached) return cached;
  }

  const chats = await prisma.chat.findMany({
    where: {
      userId,
      ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    select: { id: true, title: true, pinned: true, model: true, updatedAt: true, createdAt: true },
  });

  if (!search) {
    await redis.set(listCacheKey(userId), chats, 30);
  }
  return chats;
}

async function create(userId, dto) {
  const chat = await prisma.chat.create({
    data: { userId, title: dto.title ?? "New chat", model: dto.model ?? "gpt-4o-mini" },
  });
  await redis.invalidate(listCacheKey(userId));
  return chat;
}

async function findOneOrThrow(userId, chatId) {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!chat) throw new NotFoundError("Chat not found");
  if (chat.userId !== userId) throw new ForbiddenError("You do not have access to this chat");
  return chat;
}

async function update(userId, chatId, dto) {
  await findOneOrThrow(userId, chatId);
  const chat = await prisma.chat.update({ where: { id: chatId }, data: dto });
  await redis.invalidate(listCacheKey(userId));
  return chat;
}

async function remove(userId, chatId) {
  await findOneOrThrow(userId, chatId);
  await prisma.chat.delete({ where: { id: chatId } });
  await redis.invalidate(listCacheKey(userId));
  return { success: true };
}

module.exports = { list, create, findOneOrThrow, update, remove };
