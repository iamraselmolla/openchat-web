const { z } = require("zod");

const streamChatSchema = z.object({
  content: z.string().min(1),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(8192).optional(),
  systemPrompt: z.string().optional(),
});

module.exports = { streamChatSchema };
