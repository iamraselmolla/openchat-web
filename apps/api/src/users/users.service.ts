import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });
    if (!user) throw new NotFoundException("User not found");
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  async updateSettings(
    userId: string,
    data: Partial<{
      theme: string;
      language: string;
      defaultModel: string;
      temperature: number;
      maxTokens: number;
      systemPrompt: string;
    }>,
  ) {
    return this.prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }
}
