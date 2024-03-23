const router = require("express").Router();
const { userAuth } = require("../middlewares/auth");
const {
  accessUserChat,
  fetchUserChats,
} = require("../controllers/chat.controller");

router.post("/", userAuth, accessUserChat);
router.get("/", userAuth, fetchUserChats);

module.exports = router;
