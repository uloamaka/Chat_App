const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtSecret = process.env.jwtSecret;
const CLIENT_URL = process.env.baseUrl;
const InviteFriend = require("../models/inviteFriend.model");
const User = require("../models/user.model")
const { newContactEmail } = require("./mailer/email.service");
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
} = require("../errors/httpErrorCodes");


const generateToken = async (loggedInUser) => {
  const token = jwt.sign(
    {
      inviteSenderId: loggedInUser.id,
      inviteSenderEmail: loggedInUser.email,
    },
    jwtSecret,
    { expiresIn: 7 * 24 * 60 * 60}
  );
  return token;
};

const verifyToken = async (invite_token) => {
  try {
    const decodedToken = jwt.verify(invite_token, jwtSecret);

    const currentTime = Math.floor(Date.now() / 1000);

    if (!decodedToken || (decodedToken.exp && decodedToken.exp < currentTime)) {
      throw new Unauthorized("Reset token is expired", EXPIRED_TOKEN);
    }

    return {
      senderId: decodedToken.inviteSenderId,
    };
  } catch (err) {
    throw new Unauthorized(err.message, MALFORMED_TOKEN);
  }
};

const invitationRegUrl = async (token, email) => {
  return `${CLIENT_URL}api/v1/auth/register?invite_token=${token}&receiver_email=${email}`;
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
          const link = await invitationRegUrl(token, email);
          const newInvitation = new InviteFriend({
            sender: loggedInUser.id,
            receiver: email,
            inviteToken: token,
          });
          const savedInvitation = await newInvitation.save();
          let senderEmail = loggedInUser.username;
          await newContactEmail(email, senderEmail, link);
          return savedInvitation;
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

const acceptInvitationFunc = async (invite_token, urlEmail) => {
  result = await verifyToken(invite_token);
  const inviterId = result.senderId;
  // fetch InviteFriends to update inviteStatus to accepted
 const updatedInvitation = await InviteFriend.findOneAndUpdate(
   {
     inviteStatus: "pending",
     sender: inviterId,
     receiver: urlEmail,
   },
   { inviteStatus: "accepted", inviteToken: null },
   { new: true }
  );

  return updatedInvitation; 
};

const updateSendersContactFunc = async (inviterId, user_id) => {
  const updatedSendersContactList = await User.findOneAndUpdate(
    { _id: inviterId._id },
    {
      contacts: user_id._id,
    },
    { new: true }
  );
  if (!updatedSendersContactList) {
     throw new ResourceNotFound(
       "Inviter was not found in DB",
       RESOURCE_NOT_FOUND
     );
  }
}

module.exports = {
  invitationFunc,
  acceptInvitationFunc,
  updateSendersContactFunc,
};
