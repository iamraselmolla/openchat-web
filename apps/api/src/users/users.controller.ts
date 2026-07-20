import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser, RequestUser } from "../common/decorators/current-user.decorator";
import { UsersService } from "./users.service";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("me")
  getProfile(@CurrentUser() user: RequestUser) {
    return this.usersService.getProfile(user.userId);
  }

  @Patch("me")
  updateProfile(@CurrentUser() user: RequestUser, @Body() body: { name?: string; avatarUrl?: string }) {
    return this.usersService.updateProfile(user.userId, body);
  }

  @Patch("me/settings")
  updateSettings(@CurrentUser() user: RequestUser, @Body() body: Record<string, unknown>) {
    return this.usersService.updateSettings(user.userId, body);
  }
}
