import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";

@Injectable()
export class ChatsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  private listCacheKey(userId: string) {
    return `chats:list:${userId}`;
  }

  async list(userId: string, search?: string) {
    // Cache only the unfiltered list — search results are cheap enough to hit the DB directly.
    if (!search) {
      const cached = await this.redis.get(this.listCacheKey(userId));
      if (cached) return cached;
    }

    const chats = await this.prisma.chat.findMany({
      where: {
        userId,
        ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
      },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      select: { id: true, title: true, pinned: true, model: true, updatedAt: true, createdAt: true },
    });

    if (!search) {
      await this.redis.set(this.listCacheKey(userId), chats, 30);
    }
    return chats;
  }

  async create(userId: string, dto: CreateChatDto) {
    const chat = await this.prisma.chat.create({
      data: { userId, title: dto.title ?? "New chat", model: dto.model ?? "gpt-4o-mini" },
    });
    await this.redis.invalidate(this.listCacheKey(userId));
    return chat;
  }

  async findOneOrThrow(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!chat) throw new NotFoundException("Chat not found");
    if (chat.userId !== userId) throw new ForbiddenException("You do not have access to this chat");
    return chat;
  }

  async update(userId: string, chatId: string, dto: UpdateChatDto) {
    await this.findOneOrThrow(userId, chatId);
    const chat = await this.prisma.chat.update({ where: { id: chatId }, data: dto });
    await this.redis.invalidate(this.listCacheKey(userId));
    return chat;
  }

  async remove(userId: string, chatId: string) {
    await this.findOneOrThrow(userId, chatId);
    await this.prisma.chat.delete({ where: { id: chatId } });
    await this.redis.invalidate(this.listCacheKey(userId));
    return { success: true };
  }
}
