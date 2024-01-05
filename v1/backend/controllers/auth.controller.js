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
const User = require("../models/user.model");

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

const {
  resetPasswordEmail,
  sendConfirmationEmail,
} = require("../utils/mailer/email.service");
const {
  acceptInvitationFunc,
  updateSendersContactFunc,
} = require("../utils/inviteHelpers");

const registerUser = async (req, res) => {
  let inviterId;
  const invite_token = req.query.invite_token;
  const urlEmail = req.query.receiver_email;
  if (invite_token) {
    const updatedInvitation = await acceptInvitationFunc(
      invite_token,
      urlEmail
    );
    inviterId = updatedInvitation.sender; // Get the inviter's Id after verification
  }
  // Validate user Input
  const userSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    username: usernameSchema,
  });
  const validUser = userSchema.parse(req.body);
  const { username, email, password } = validUser;

  // Check for existing user
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new Conflict("Email already exists", EXISTING_USER_EMAIL);
  }

  bcrypt.hash(password, 10, async function (err, hash) {
    if (err) {
      throw new Unauthorized("Error hashing password", MALFORMED_TOKEN);
    }
    const user = await User.create({
      username,
      email,
      password: hash,
      contacts: inviterId ? [inviterId] : [], // Add inviter's Id to user's contact list if inviter's Id is avialable
    });

    const maxAge = 6 * 60 * 60;

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        username: user.username,
      },
      jwtSecret,
      {
        expiresIn: maxAge,
      }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    let user_id = user._id;
    // Update sender's contacts if applicable
    if (invite_token) {
      updateSendersContactFunc(inviterId, user_id);
    }
    return res.created({
      message: { username, email, user_id },
    });
  });
};

const loginUser = async (req, res, next) => {
  const userSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  const validUser = userSchema.parse(req.body);
  const { email, password } = validUser;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ResourceNotFound(
      "No record of this account, sign up now.",
      RESOURCE_NOT_FOUND
    );
  }
    const safeUser = {
      _id: user._id,
      role: user.role,
      email: user.email,
      username: user.username,
      pic: user.pic,
    };
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      throw new Error("Error comparing passwords");
    }
    if (result) {
      const maxAge = 1 * 60 * 60;
      const token = jwt.sign(
        {
          safeUser,
        },
        jwtSecret,
        {
          expiresIn: maxAge * 1000, 
        }
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
    }
    console.log(safeUser)
    return res.ok({
      message: "Login successful",
      user: safeUser,
    });
  });
};

const updateUserRole = async (req, res, next) => {
  const { role, user_id } = req.body;

  if (!role || !user_id) {
    throw new BadRequest(
      "Provide user_id and role",
      INVALID_REQUEST_PARAMETERS
    );
  }
  const user = await User.findById(user_id);

  if (!user) {
    throw new ResourceNotFound("User does not exist", RESOURCE_NOT_FOUND);
  }
  // Verifying if the user is not already an admin
  if (user.role !== "admin") {
    user.role = role;
    await user.save();
  }
  return res.ok({
    message: "Update successful",
    user_role: user.role,
  });
};
const deleteUser = async (req, res, next) => {
  const { user_id } = req.body;
  const user = await User.findByIdAndDelete(user_id);
  if (!user) {
    throw new ResourceNotFound("User does not exist", RESOURCE_NOT_FOUND);
  }
  return res.noContent();
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ResourceNotFound("User does not exist", RESOURCE_NOT_FOUND);
  }
  const otpToken = jwtSecret + user.password;
  const resetToken = jwt.sign({ id: user._id, email }, otpToken, {
    expiresIn: "1h",
  });
  let userId = user._id;
  const resetLink = `${CLIENT_URL}api/v1/auth/reset-password/${userId}/${resetToken}`;
  //const resetLink = `http://localhost:3000/api/v1/auth/reset-password/${userId}/${resetToken}`;

  const username = user.username;
  await resetPasswordEmail(email, username, resetLink);
  return res.ok("Reset link sent successfully");
};

const resetPassword = async (req, res) => {
  const { resetToken, userId } = req.params;
  const { newPassword, confirmPassword } = req.body;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new ResourceNotFound("User does not exist", RESOURCE_NOT_FOUND);
  }
  if (!newPassword || !confirmPassword) {
    throw new BadRequest("No password provided", INVALID_REQUEST_PARAMETERS);
  }
  if (newPassword !== confirmPassword) {
    throw new BadRequest(
      "New password and Confirm password must match",
      INVALID_REQUEST_PARAMETERS
    );
  }
  const otpToken = jwtSecret + user.password;
  try {
    decodedToken = jwt.verify(resetToken, otpToken);
  } catch (err) {
    throw new Unauthorized(err.message, MALFORMED_TOKEN);
  }
  const currentTime = Math.floor(Date.now() / 1000);
  if (!decodedToken || (decodedToken.exp && decodedToken.exp < currentTime)) {
    throw new Unauthorized("Reset token is expired", EXPIRED_TOKEN);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.updateOne(
    { _id: userId },
    { password: hashedPassword },
    {
      new: true,
    }
  );
  const username = user.username,
    email = user.email;

  await sendConfirmationEmail(email, username);
  return res.ok("Password reset successful");
};

module.exports = {
  registerUser,
  loginUser,
  updateUserRole,
  deleteUser,
  forgotPassword,
  resetPassword,
};
