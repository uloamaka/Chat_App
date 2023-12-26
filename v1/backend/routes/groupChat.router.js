const router = require("express").Router();
const { multerUploader } = require("../utils/cloudinary");
const { userAuth } = require("../middlewares/auth");
const { createGroupChat } = require("../controllers/groupChat.controller");

router.post("/", userAuth, multerUploader.single("image"), createGroupChat);
// router.get("/", userAuth, fetchUserChats);

module.exports = router;
