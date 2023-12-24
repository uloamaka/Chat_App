const router = require("express").Router();
const { userAuth } = require("../middlewares/auth");
const controller = require("../controllers/invite.controller")

router.post("/new_contact", userAuth,
  controller.inviteFriend);

module.exports = router