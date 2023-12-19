// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");
// const jwtSecret = process.env.jwtSecret;
// const baseUrl = process.env.baseUrl; // change to client URL
// const InviteFriend = require("../models/inviteFriend.model");
// const { BadRequest } = require("../errors/httpErrors");
// const { INVALID_REQUEST_PARAMETERS } = require("../errors/httpErrorCodes");
// const { newContactEmail } = require("./mailer/email.service");

// const maxAge = 7 * 24 * 60 * 60;

// const generateToken = async (loggedInUser) => {
//   const token = jwt.sign(
//     {
//       inviteSenderId: loggedInUser.id,
//       inviteSenderEmail: loggedInUser.email,
//     },
//     jwtSecret,
//     { expiresIn: maxAge }
//   );
//   return token;
// };

// const invitationRegUrl = async (token) => {
//   return `${baseUrl}api/v1/auth/register?invite-token=${token}`;
// };

// const invitationFunc = async (emailList, loggedInUser) => {
//   console.log(loggedInUser);
//   const userId = loggedInUser.id;
//   console.log(userId);
//   const senderEmail = loggedInUser.email;
//   const invitations = await Promise.all(
//     emailList.map(async (email) => {
//       if (email !== loggedInUser.email) {
//         const token = await generateToken();
//         const link = await invitationRegUrl(token); // Get a unique token for each invite
//         const newInvitation = new InviteFriend({
//           sender: userId,
//           receiver: email,
//           inviteToken: token,
//         });
//         newContactEmail(senderEmail, email, link);
//         return await newInvitation.save();
//       }
//       throw new BadRequest(
//         "Can not send invite to yourself",
//         INVALID_REQUEST_PARAMETERS
//       );
//     })
//   );

//   return { invitations, message: "Invitation sent success" }; // Return the saved invitations
// };

// module.exports = { invitationFunc };





// once the invitee uses the link to reg,
// then the invite-token is taking from the query,
// then verify the token if it is still valid,
// then  to fetch the invitation from db
// then create contact for both of inviter and invitee.

// to generate a one token
// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");
// const jwtSecret = process.env.jwtSecret;
// const baseUrl = process.env.baseUrl; // change to client URL
// const InviteFriend = require("../models/inviteFriend.model");

// const maxAge = 7 * 24 * 60 * 60;

// const invitationRegUrl = (loggedInUser) => {
//   const token = jwt.sign(
//     {
//       inviteSenderId: loggedInUser.id,
//       inviteSenderEmail: loggedInUser.email,
//     },
//     jwtSecret,
//     { expiresIn: maxAge }
//   );

//   return `${baseUrl}api/v1/auth/register?invite-token=${token}`;
// };

// const invitationFunc = async (emailList, loggedInUser) => {
//   const token = invitationRegUrl(loggedInUser); // Generate a single token for all emails

//   const invitations = await Promise.all(
//     emailList.map(async (email) => {
//       const newInvitation = new InviteFriend({
//         sender: loggedInUser.email,
//         receiver: email,
//         inviteToken: token,
//       });
//       return await newInvitation.save();
//     })
//   );

//   return invitations; // Return the saved invitations
// };

// module.exports = { invitationFunc };





const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtSecret = process.env.jwtSecret;
const baseUrl = process.env.baseUrl;
const InviteFriend = require("../models/inviteFriend.model");
const { BadRequest } = require("../errors/httpErrors");
const { INVALID_REQUEST_PARAMETERS } = require("../errors/httpErrorCodes");
const { newContactEmail } = require("./mailer/email.service");

const maxAge = 7 * 24 * 60 * 60;

const generateToken = async (loggedInUser) => {
  const token = jwt.sign(
    {
      inviteSenderId: loggedInUser.id,
      inviteSenderEmail: loggedInUser.email,
    },
    jwtSecret,
    { expiresIn: maxAge }
  );
  return token;
};

const invitationRegUrl = async (token) => {
  return `${baseUrl}api/v1/auth/register?invite-token=${token}`;
};
// Generate a single token for all invitations
const invitationFunc = async (emailList, loggedInUser) => {
  try {
    if (
      !Array.isArray(emailList) ||
      !emailList.every((email) => typeof email === "string")
    ) {
      throw new BadRequest("Invalid email list", INVALID_REQUEST_PARAMETERS);
    }

    if (!loggedInUser || !loggedInUser.id || !loggedInUser.email) {
      throw new BadRequest(
        "Invalid loggedInUser data",
        INVALID_REQUEST_PARAMETERS
      );
    }

    const token = await generateToken(loggedInUser);
    const invitations = await Promise.all(
      emailList.map(async (email) => {
        if (email !== loggedInUser.email) {
          const link = await invitationRegUrl(token);
          const newInvitation = new InviteFriend({
            sender: loggedInUser.id,
            receiver: email,
            inviteToken: token,
          });
          await newContactEmail(loggedInUser.email, email, link);
          return newInvitation;
        } else {
          throw new BadRequest(
            "Cannot send invite to yourself",
            INVALID_REQUEST_PARAMETERS
          );
        }
      })
    );

    return { invitations, message: "Invitation sent success" };
  } catch (error) {
    console.error(error);
    throw new BadRequest(
      "Failed to send invitations",
      INVALID_REQUEST_PARAMETERS
    );
  }
};

module.exports = { invitationFunc };
