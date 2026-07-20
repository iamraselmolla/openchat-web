import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateChatDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean;
}
