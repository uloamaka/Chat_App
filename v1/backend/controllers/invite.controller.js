const {
  //   ResourceNotFound,
  BadRequest,
  //   ServerError,
  //   Conflict,
  //   Unauthorized,
} = require("../errors/httpErrors");
const {
  //   RESOURCE_NOT_FOUND,
  INVALID_REQUEST_PARAMETERS,
  //   EXISTING_USER_EMAIL,
  //   MALFORMED_TOKEN,
  //   EXPIRED_TOKEN,
} = require("../errors/httpErrorCodes");
const { sendInvitationFunc } = require("../utils/inviteHelpers");

const InviteFriend = require("../models/inviteFriend.model");

const inviteFriend = async (req, res) => {
  const { friendList } = req.body;
  const loggedInUser = req.user;
  if (!Array.isArray(friendList) || friendList.length === 0) {
    throw new BadRequest("Please select friends", INVALID_REQUEST_PARAMETERS);
  }
  const pendingInvites = await InviteFriend.find({
    inviteStatus: "pending",
    sender: loggedInUser.id,
  });
  const pendingReceivers = new Set(
    pendingInvites.map((invite) => invite.receiver)
  );
  // Filter friendList for those who haven't been invited yet
  const emailList = friendList.filter((email) => !pendingReceivers.has(email));
  if (emailList.length === 0) {
    throw new BadRequest(
      "Friends were already invited by you!",
      INVALID_REQUEST_PARAMETERS
    );
  }
  await sendInvitationFunc(emailList, loggedInUser);

  return res.ok({ message: "Invitations sent successfully" });
};

const getAllInvitation = async (req, res) => {
  const { invite_token } = req.query;
};
const deleteInvitation = async (req, res) => {
  const { invite_token } = req.query;
};

module.exports = {
  inviteFriend,
  getAllInvitation,
  deleteInvitation,
};
