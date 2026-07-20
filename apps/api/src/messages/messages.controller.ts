import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser, RequestUser } from "../common/decorators/current-user.decorator";
import { MessagesService } from "./messages.service";

@UseGuards(JwtAuthGuard)
@Controller("chats/:chatId/messages")
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  list(@CurrentUser() user: RequestUser, @Param("chatId") chatId: string) {
    return this.messagesService.listForChat(user.userId, chatId);
  }

  @Patch(":messageId")
  edit(
    @CurrentUser() user: RequestUser,
    @Param("chatId") chatId: string,
    @Param("messageId") messageId: string,
    @Body("content") content: string,
  ) {
    return this.messagesService.editAndTruncate(user.userId, chatId, messageId, content);
  }

  @Delete(":messageId")
  remove(
    @CurrentUser() user: RequestUser,
    @Param("chatId") chatId: string,
    @Param("messageId") messageId: string,
  ) {
    return this.messagesService.remove(user.userId, chatId, messageId);
  }
}
