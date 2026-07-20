import { IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @IsIn(["user", "assistant", "system"])
  role?: "user" | "assistant" | "system";
}
