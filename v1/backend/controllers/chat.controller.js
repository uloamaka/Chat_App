const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { z } = require("zod");
const {
  emailSchema,
  passwordSchema,
  usernameSchema,
} = require("../validators/formRegister.validator");
const jwtSecret = process.env.jwtSecret;
const CLIENT_URL = process.env.baseUrl;
const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const Message = require("../models/message.model");

const {
  ResourceNotFound,
  BadRequest,
  Conflict,
  Unauthorized,
} = require("../errors/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  INVALID_REQUEST_PARAMETERS,
  EXISTING_USER_EMAIL,
  MALFORMED_TOKEN,
  EXPIRED_TOKEN,
} = require("../errors/httpErrorCodes");

const accessUserChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new BadRequest("UserId is required", INVALID_REQUEST_PARAMETERS);
  }
  let isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });
  if (isChat.length > 0) {
    return res.ok(isChat[0]);
  }
  let chatData = {
    chatName: "sender",
    participants: [req.user.id, userId],
  };
  const newChat = await Chat.create(chatData);
  const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
    "participants",
    "-password -contacts"
  );

  return res.created(fullChat);
};

const fetchUserChats = async (req, res) => {
  Chat.find({ participants: { $elemMatch: { $eq: req.user.id } } })
    .populate("participants", "-password -contacts -role")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email ",
      });
      return res.ok(results);
    });
};

module.exports = { accessUserChat, fetchUserChats };
