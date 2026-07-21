const { z } = require("zod");

const createMessageSchema = z.object({
  content: z.string().min(1),
  role: z.enum(["user", "assistant", "system"]).optional(),
});

// The original Nest controller read @Body("content") directly with no DTO,
// but validating it the same way as create keeps edits equally safe.
const editMessageSchema = z.object({
  content: z.string().min(1),
});

module.exports = { createMessageSchema, editMessageSchema };
