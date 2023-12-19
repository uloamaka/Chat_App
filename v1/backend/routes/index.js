const router = require("express").Router();

const authRouter = require("./auth.router");
const inviteRouter = require("./invite.router");

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Hallo! This is the chat app built with MERN",
  });
});

router.use("/auth", authRouter);
router.use("/invite", inviteRouter);

module.exports = router;
