const { prisma } = require("../../lib/prisma");
const { NotFoundError, ForbiddenError } = require("../../lib/errors");

async function assertChatOwnership(userId, chatId) {
  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat) throw new NotFoundError("Chat not found");
  if (chat.userId !== userId) throw new ForbiddenError("You do not have access to this chat");
  return chat;
}

async function listForChat(userId, chatId) {
  await assertChatOwnership(userId, chatId);
  return prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
  });
}

/** Used when a user edits a previous message: soft branch by trimming everything after it. */
async function editAndTruncate(userId, chatId, messageId, newContent) {
  await assertChatOwnership(userId, chatId);
  const target = await prisma.message.findUnique({ where: { id: messageId } });
  if (!target || target.chatId !== chatId) throw new NotFoundError("Message not found");

  await prisma.message.deleteMany({
    where: { chatId, createdAt: { gt: target.createdAt } },
  });

  return prisma.message.update({
    where: { id: messageId },
    data: { content: newContent },
  });
}

async function remove(userId, chatId, messageId) {
  await assertChatOwnership(userId, chatId);
  await prisma.message.delete({ where: { id: messageId } });
  return { success: true };
}

module.exports = { listForChat, editAndTruncate, remove };
