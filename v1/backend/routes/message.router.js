const router = require("express").Router();
const { userAuth } = require("../middlewares/auth");
const controller = require("../controllers/messages.controller");

router.post("/", userAuth, controller.sendMessage);
router.get("/:chatId", userAuth, controller.allMessages);

module.exports = router;
