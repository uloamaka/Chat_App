const router = require("express").Router();
const { userAuth } = require("../middlewares/auth");
const {allUsers} = require("../controllers/user.controller");

router.get("/", userAuth, allUsers);

module.exports = router;
