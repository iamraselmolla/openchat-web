const { Router } = require("express");
const { requireAuth } = require("../../middleware/auth");
const { validateBody } = require("../../middleware/validate");
const { editMessageSchema } = require("../../schemas/message.schema");
const controller = require("./messages.controller");

// mergeParams lets this router read :chatId from the parent mount path.
const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", controller.list);
router.patch("/:messageId", validateBody(editMessageSchema), controller.edit);
router.delete("/:messageId", controller.remove);

module.exports = router;
