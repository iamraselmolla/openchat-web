import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class StreamChatDto {
  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8192)
  maxTokens?: number;

  @IsOptional()
  @IsString()
  systemPrompt?: string;
}
