const router = require("express").Router();
const { multerUploader } = require("../utils/cloudinary");
const { userAuth } = require("../middlewares/auth");
const {
  createGroupChat,
  fetchGroupChat,
  renameGroupChat,
  editGroupStatus,
  editGroupIcon,
  addGroupMember,
  removeGroupMember,
  deleteGroupChat,
  exitGroupChat,
} = require("../controllers/groupChat.controller");

router.post("/", userAuth, multerUploader.single("image"), createGroupChat);
router.get("/", userAuth, fetchGroupChat);
router.patch("/update-name", userAuth, renameGroupChat);
router.patch("/update-status", userAuth, editGroupStatus);
router.patch(
  "/update-icon",
  userAuth,
  multerUploader.single("image"),
  editGroupIcon
);
router.patch("/add-new-member", userAuth, addGroupMember);
router.patch("/remove-member", userAuth, removeGroupMember);
router.patch("/delete-group", userAuth, deleteGroupChat);
router.patch("/exit-group", userAuth, exitGroupChat);

module.exports = router;
