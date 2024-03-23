const GroupChat = require("../models/groupChat.model");

const {
  ResourceNotFound,
  BadRequest,
  Unauthorized,
} = require("../errors/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  INVALID_REQUEST_PARAMETERS,
  MALFORMED_TOKEN,
  EXPIRED_TOKEN,
  INSUFFICIENT_PERMISSIONS,
} = require("../errors/httpErrorCodes");

const isGroupAdmin = async (groupChatId, userId) => {
  const result = await GroupChat.findById(groupChatId)
    .select("is_admin")
    .where("is_admin")
    .equals(userId);
  return result ? true : false;
};

const GroupExist = async (groupChatId) => {
     const result = await GroupChat.findById(groupChatId)
     return result ? true : false; 
}

module.exports = {
  isGroupAdmin,
  GroupExist,
};
