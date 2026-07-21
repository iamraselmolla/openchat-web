const { Router } = require("express");
const { requireAuth } = require("../../middleware/auth");
const controller = require("./users.controller");

const router = Router();

router.use(requireAuth);

router.get("/me", controller.getProfile);
router.patch("/me", controller.updateProfile);
router.patch("/me/settings", controller.updateSettings);

module.exports = router;
