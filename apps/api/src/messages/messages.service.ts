import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  private async assertChatOwnership(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) throw new NotFoundException("Chat not found");
    if (chat.userId !== userId) throw new ForbiddenException("You do not have access to this chat");
    return chat;
  }

  async listForChat(userId: string, chatId: string) {
    await this.assertChatOwnership(userId, chatId);
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });
  }

  /** Used when a user edits a previous message: soft branch by trimming everything after it. */
  async editAndTruncate(userId: string, chatId: string, messageId: string, newContent: string) {
    await this.assertChatOwnership(userId, chatId);
    const target = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!target || target.chatId !== chatId) throw new NotFoundException("Message not found");

    await this.prisma.message.deleteMany({
      where: { chatId, createdAt: { gt: target.createdAt } },
    });

    return this.prisma.message.update({
      where: { id: messageId },
      data: { content: newContent },
    });
  }

  async remove(userId: string, chatId: string, messageId: string) {
    await this.assertChatOwnership(userId, chatId);
    await this.prisma.message.delete({ where: { id: messageId } });
    return { success: true };
  }
}
