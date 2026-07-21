const { Router } = require("express");
const { requireAuth } = require("../../middleware/auth");
const { validateBody } = require("../../middleware/validate");
const { streamChatSchema } = require("../../schemas/ai.schema");
const controller = require("./ai.controller");

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.post("/", validateBody(streamChatSchema), controller.stream);

module.exports = router;
