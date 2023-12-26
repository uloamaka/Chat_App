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
const { isGroupAdmin } = require("../utils/chatHelper");
const {
  ResourceNotFound,
  BadRequest,
  Conflict,
  Unauthorized,
} = require("../errors/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  INVALID_REQUEST_PARAMETERS,
  INSUFFICIENT_PERMISSIONS,
} = require("../errors/httpErrorCodes");

const createGroupChat = async (req, res) => {
  const { name, status, members } = req.body;
  if (!name || !members || members.length < 2) {
    throw new BadRequest(
      "Group name and at least two members field are required",
      INVALID_REQUEST_PARAMETERS
    );
  }
  const icon = req.file ? await imageUploader(req.file.path) : null; // Allow optional icon

  let participants = Array.isArray(members) ? members : JSON.parse(members); // Ensure member is an array

  participants.push(req.user.id);

  const newGroupChat = await GroupChat.create({
    name,
    icon: icon || "https://res.cloudinary.com/dsffatdpd/image/upload/v1685691602/baca/logo_aqssg3.jpg",
    status,
    participants,
    creator_id: req.user.id,
    is_admin: req.user.id,
  });

  const fullGroupChat = await GroupChat.findOne({ _id: newGroupChat._id })
    .populate({ path: "participants", select: "-password" })
    .populate("is_admin", "-password")
    .populate("creator_id", "-password");

  return res.created(fullGroupChat);
};

const fetchGroupChat = async (req, res) => {
  GroupChat.find({ participants: { $elemMatch: { $eq: req.user.id } } })
    .populate("participants", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name email",
      });
      return res.ok(results);
    });
};

const renameGroupChat = async (req, res) => {
  const { groupChatId, name } = req.body;
  if (!name || !groupChatId) {
    throw new BadRequest(
      "Provide the new name and group_chat_Id",
      INVALID_REQUEST_PARAMETERS
    );
  }
  const isAdmin = await isGroupAdmin(groupChatId, req.user.id);
  if (!isAdmin) {
    throw new Unauthorized(
      "Only group admins can rename groups",
      INSUFFICIENT_PERMISSIONS
    );
  }
  const updatedGroupname = await GroupChat.findByIdAndUpdate(
    groupChatId,
    { name: name },
    { new: true }
  )
    .populate("participants", "password")
    .populate("is_admin", "-password")
    .populate("creator_id", "-password");

  if (!updatedGroupname) {
    throw new ResourceNotFound(
      `The Group with the ID:${groupChatId} was not found`,
      RESOURCE_NOT_FOUND
    );
  }

  return res.ok(updatedGroupname);
};

const editGroupStatus = async (req, res) => {
  const { groupChatId, status } = req.body;

  if (!status || !groupChatId) {
    throw new BadRequest(
      "Provide the group_chat_Id",
      INVALID_REQUEST_PARAMETERS
    );
  }
  const isAdmin = await isGroupAdmin(groupChatId, req.user.id);
  if (!isAdmin) {
    throw new Unauthorized(
      "Only group admins can edit groups",
      INSUFFICIENT_PERMISSIONS
    );
  }

  const updatedGroupStatus = await GroupChat.findByIdAndUpdate(
    groupChatId,
    { status: status },
    { new: true }
  )
    .populate("participants", "password")
    .populate("is_admin", "-password")
    .populate("creator_id", "-password");

  if (!updatedGroupStatus) {
    throw new ResourceNotFound(
      `The Group with the ID:${groupChatId} was not found`,
      RESOURCE_NOT_FOUND
    );
  }
  return res.ok( updatedGroupStatus);
};

const editGroupIcon = async (req, res) => {
  const { groupChatId } = req.body;
  if (!groupChatId) {
    throw new BadRequest(
      "Provide the group_chat_Id",
      INVALID_REQUEST_PARAMETERS
    );
  }
  if (!req.file) {
    throw new BadRequest(
      "Provide the new image file",
      INVALID_REQUEST_PARAMETERS
    );
  }
  const { path } = req.file;
  const icon = await imageUploader(path);
  const isAdmin = await isGroupAdmin(groupChatId, req.user.id);
  if (!isAdmin) {
    throw new Unauthorized(
      "Only group admins can edit groups",
      INSUFFICIENT_PERMISSIONS
    );
  }

  const updatedGroupIcon = await GroupChat.findByIdAndUpdate(
    groupChatId,
    { icon: icon },
    { new: true }
  )
    .populate("participants", "password")
    .populate("is_admin", "-password")
    .populate("creator_id", "-password");
  if (!updatedGroupIcon) {
    throw new ResourceNotFound(
      `The Group with the ID:${groupChatId} was not found`,
      RESOURCE_NOT_FOUND
    );
  }
  return res.ok("update successful", updatedGroupIcon);
};

const addGroupMember = async (req, res) => {
  const { groupChatId, userId } = req.body;

  if (!userId || !groupChatId) {
    throw new BadRequest(
      "Provide the new name and group_chat_Id",
      INVALID_REQUEST_PARAMETERS
    );
  }

  const isAdmin = await isGroupAdmin(groupChatId, req.user.id);
  if (!isAdmin) {
    throw new Unauthorized(
      "Only group admins can add members",
      INSUFFICIENT_PERMISSIONS
    );
  }
  const addedMember = await GroupChat.findByIdAndUpdate(
    groupChatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("participants", "password")
    .populate("is_admin", "-password")
    .populate("creator_id", "-password");
  if (!addedMember) {
    throw new ResourceNotFound(
      `The Group with the ID:${groupChatId} was not found`,
      RESOURCE_NOT_FOUND
    );
  }
  return res.ok("Added a new member successfully", addedMember);
};

const removeGroupMember = async (req, res) => {
  const { groupChatId, userId } = req.body;

  if (!userId || !groupChatId) {
    throw new BadRequest(
      "Provide the new name and group_chat_Id",
      INVALID_REQUEST_PARAMETERS
    );
  }

  const isAdmin = await isGroupAdmin(groupChatId, req.user.id);
  if (!isAdmin) {
    throw new Unauthorized(
      "Only group admins can remove members",
      INSUFFICIENT_PERMISSIONS
    );
  }
  const removedMember = await GroupChat.findByIdAndUpdate(
    groupChatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("participants", "password")
    .populate("is_admin", "-password")
    .populate("creator_id", "-password");
  if (!removedMember) {
    throw new ResourceNotFound(
      `The Group with the ID:${groupChatId} was not found`,
      RESOURCE_NOT_FOUND
    );
  }
  return res.ok("Removed a member successfully", removedMember);
};

const deleteGroupChat = async (req, res) => {
  const { groupChatId } = req.body;

  if (!groupChatId) {
    throw new BadRequest(
      "Provide the new name and group_chat_Id",
      INVALID_REQUEST_PARAMETERS
    );
  }

  const isAdmin = await isGroupAdmin(groupChatId, req.user.id);
  if (!isAdmin) {
    throw new Unauthorized(
      "Only group admins can remove members",
      INSUFFICIENT_PERMISSIONS
    );
  }
  const deletedGroup = await GroupChat.findByIdAndDelete(groupChatId);
  if (!deletedGroup) {
    throw new ResourceNotFound(
      `The Group with the ID:${groupChatId} was not found`,
      RESOURCE_NOT_FOUND
    );
  }
  return res.noContent();
};
const exitGroupChat = async (req, res) => {
  const { groupChatId } = req.body;

  if (!groupChatId) {
    throw new BadRequest(
      "Provide the group_chat_Id",
      INVALID_REQUEST_PARAMETERS
    );
  }

  const leftGroup = await GroupChat.findByIdAndUpdate(
    groupChatId,
    { $pull: { users: req.user.id } },
    { new: true }
  )
    .populate("participants", "password")
    .populate("is_admin", "-password")
    .populate("creator_id", "-password");
  if (!leftGroup) {
    throw new ResourceNotFound(
      `The Group with the ID:${groupChatId} was not found`,
      RESOURCE_NOT_FOUND
    );
  }
  return res.ok("Removed a member successfully", removedMember);
};
module.exports = {
  createGroupChat,
  fetchGroupChat,
  renameGroupChat,
  editGroupStatus,
  editGroupIcon,
  addGroupMember,
  removeGroupMember,
  deleteGroupChat,
  exitGroupChat,
};
