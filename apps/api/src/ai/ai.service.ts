import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

export interface ChatTurn {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamOptions {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

/**
 * Wraps the OpenAI SDK. Keeps token-by-token streaming isolated from
 * NestJS/HTTP concerns so it is easy to swap providers later.
 */
@Injectable()
export class AiService {
  private client: OpenAI;

  constructor(private config: ConfigService) {
    this.client = new OpenAI({ apiKey: this.config.get<string>("openai.apiKey") });
  }

  async *streamCompletion(history: ChatTurn[], options: StreamOptions): AsyncGenerator<string> {
    const messages: ChatTurn[] = options.systemPrompt
      ? [{ role: "system", content: options.systemPrompt }, ...history]
      : history;

    const stream = await this.client.chat.completions.create({
      model: options.model,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) yield token;
    }
  }
}
