const router = require("express").Router();

const authRouter = require("./auth.router");
const inviteRouter = require("./invite.router");
const userROuter = require("./user.router");
const chatRouter = require("./chat.router");
const groupChatRouter = require("./groupChat.router");
const messageRouter = require("./message.router")

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Hallo! This is the chat app built with MERN",
  });
});

router.use("/auth", authRouter);
router.use("/invite", inviteRouter);
router.use("/user", userROuter);
router.use("/chat", chatRouter);
router.use("/group-chat", groupChatRouter);
router.use("/message", messageRouter);

module.exports = router;
