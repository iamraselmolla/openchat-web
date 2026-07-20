import { Body, Controller, Param, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser, RequestUser } from "../common/decorators/current-user.decorator";
import { AiService } from "./ai.service";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { StreamChatDto } from "./dto/stream-chat.dto";

@UseGuards(JwtAuthGuard)
@Controller("chats/:chatId/stream")
export class AiController {
  constructor(
    private aiService: AiService,
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  /**
   * Server-Sent Events endpoint: persists the user message, streams the
   * assistant reply token-by-token, then persists the final assistant message.
   */
  @Post()
  async stream(
    @CurrentUser() user: RequestUser,
    @Param("chatId") chatId: string,
    @Body() dto: StreamChatDto,
    @Res() res: Response,
  ) {
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat || chat.userId !== user.userId) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const allowed = await this.redis.checkRateLimit(`ai:rate:${user.userId}`, 20, 60);
    if (!allowed) {
      res.status(429).json({ message: "Too many requests — please slow down." });
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    await this.prisma.message.create({
      data: { chatId, role: "user", content: dto.content },
    });

    const history = await this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      select: { role: true, content: true },
    });

    let fullResponse = "";

    try {
      for await (const token of this.aiService.streamCompletion(history, {
        model: dto.model ?? chat.model,
        temperature: dto.temperature ?? 0.7,
        maxTokens: dto.maxTokens ?? 2048,
        systemPrompt: dto.systemPrompt,
      })) {
        fullResponse += token;
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }

      await this.prisma.message.create({
        data: { chatId, role: "assistant", content: fullResponse },
      });
      await this.prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });
      await this.redis.invalidate(`chats:list:${user.userId}`);

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: "The AI response failed. Please retry." })}\n\n`);
    } finally {
      res.end();
    }
  }
}
