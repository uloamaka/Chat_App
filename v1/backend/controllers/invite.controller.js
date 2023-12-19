//send invite request
// const {
//   ResourceNotFound,
//   BadRequest,
//   ServerError,
//   Conflict,
//   Unauthorized,
// } = require("../errors/httpErrors");
// const {
//   RESOURCE_NOT_FOUND,
//   INVALID_REQUEST_PARAMETERS,
//   EXISTING_USER_EMAIL,
//   MALFORMED_TOKEN,
//   EXPIRED_TOKEN,
// } = require("../errors/httpErrorCodes");
const inviteHelper = require("../utils/inviteHelpers");
const { emailSchema } = require("../validators/invite.validator");
const { z } = require("zod");

const inviteFriend = async (req, res) => {
//     const arrayOfEmailsSchema = z.array( emailSchema );
//   const validEmailArray = arrayOfEmailsSchema.parse(req.body);
    //   const { emailList } = validEmailArray;
 const { emailList } = req.body;
  const loggedInUser = req.user;
  const invitations = await inviteHelper.invitationFunc(
    emailList,
    loggedInUser
  );
  return res.ok({
    invitations,
  });
};

module.exports = {
  inviteFriend,
};
