const { z } = require("zod");

const createChatSchema = z.object({
  title: z.string().optional(),
  model: z.string().optional(),
});

const updateChatSchema = z.object({
  title: z.string().optional(),
  pinned: z.boolean().optional(),
});

module.exports = { createChatSchema, updateChatSchema };
