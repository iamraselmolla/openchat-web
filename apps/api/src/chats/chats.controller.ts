import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser, RequestUser } from "../common/decorators/current-user.decorator";
import { ChatsService } from "./chats.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";

// @UseGuards(JwtAuthGuard)
@Controller("chats")
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get()
  list(@CurrentUser() user: RequestUser, @Query("search") search?: string) {
    return this.chatsService.list(user.userId, search);
  }

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateChatDto) {
    return this.chatsService.create(user.userId, dto);
  }

  @Get(":id")
  findOne(@CurrentUser() user: RequestUser, @Param("id") id: string) {
    return this.chatsService.findOneOrThrow(user.userId, id);
  }

  @Patch(":id")
  update(@CurrentUser() user: RequestUser, @Param("id") id: string, @Body() dto: UpdateChatDto) {
    return this.chatsService.update(user.userId, id, dto);
  }

  @Delete(":id")
  remove(@CurrentUser() user: RequestUser, @Param("id") id: string) {
    return this.chatsService.remove(user.userId, id);
  }
}
