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

const allUsers = async (req, res) => {
  // if (req.user || req.user.id) {
  //     throw new BadRequest("missing jwt token", INVALID_REQUEST_PARAMETERS);
  //   }
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          {
            email: {
              $regex: req.query.search,

              $options: "i",
            },
          },
        ],
      }
    : {};

  const users = await User.find({
    ...keyword,
    _id: { $ne: req.user.id }, 
  });
  res.ok(users);
};

module.exports = { allUsers };
