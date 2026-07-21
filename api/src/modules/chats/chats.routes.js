const { Router } = require("express");
const { requireAuth } = require("../../middleware/auth");
const { validateBody } = require("../../middleware/validate");
const { createChatSchema, updateChatSchema } = require("../../schemas/chat.schema");
const controller = require("./chats.controller");

const router = Router();

// NOTE: the original Nest controller had @UseGuards(JwtAuthGuard) commented
// out, which meant req.user was undefined and every handler here would have
// thrown. Re-enabled it here since the service reads user.userId.
router.use(requireAuth);

router.get("/", controller.list);
router.post("/", validateBody(createChatSchema), controller.create);
router.get("/:id", controller.findOne);
router.patch("/:id", validateBody(updateChatSchema), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
