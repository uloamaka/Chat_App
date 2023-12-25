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
const GroupChat = require("../models/groupChat.model");
const User = require("../models/user.model");
const { imageUploader } = require("../utils/cloudinary");
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

const createGroupChat = async (req, res) => {
  const { name, status, members } = req.body;
  const { path } = req.file;
  const icon = await imageUploader(path);
  if (!name || members.length < 2) {
    throw new BadRequest(
      "Group name and at least two members field are required",
      INVALID_REQUEST_PARAMETERS
    );
  }
  let participants = JSON.parse(members);

  participants.push(req.user.id);
  const newGroupChat = await GroupChat.create({
    name,
    icon,
    status,
    participants,
    creator_id: req.user.id,
    is_admin: req.user.id,
  });

  const fullGroupChat = await GroupChat.findOne({ _id: newGroupChat._id })
    .populate("participants", "password")
    .populate("is_admin", "-password")
    .populate("creator_id", "-password");

  return res.created(fullGroupChat);
};

const renameGroupChat = async (req, res) => {
  const { groupChatId, name } = req.body;
  if (!name || !groupChatId) {
    throw new BadRequest(
      "Provide the new name and group_chat_Id",
      INVALID_REQUEST_PARAMETERS
    );
  }
  const updatedGroup = await GroupChat.findByIdAndUpdate(
    groupChatId,
    { name: name },
    { new: true }
  )
    .populate("participants", "password")
    .populate("is_admin", "-password")
    .populate("creator_id", "-password");

  return res.ok(updatedGroup);
};
const editGroupStatus = async (req, res) => {};
const editGroupIcon = async (req, res) => {};
const addGroupMember = async (req, res) => {
  const { groupChatId, userId } = req.body;
  const addedMember = GroupChat.findByIdAndUpdate(
    groupChatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("participants", "password")
    .populate("is_admin", "-password")
    .populate("creator_id", "-password");

  return res.ok(addedMember);
};
const removeGroupMember = async (req, res) => {};
const deleteGroupChat = async (req, res) => {};
const exitGroupChat = async (req, res) => {};
module.exports = {
  createGroupChat,
  renameGroupChat,
  editGroupStatus,
  editGroupIcon,
  addGroupMember,
  removeGroupMember,
  deleteGroupChat,
  exitGroupChat,
};
