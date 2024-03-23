const jwt = require("jsonwebtoken");
require("dotenv").config();

const { Unauthorized } = require("../errors/httpErrors");
const { USER_NOT_VERIFIED } = require("../errors/httpErrorCodes");
const jwtSecret = process.env.jwtSecret;

const adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        throw new Unauthorized(err.message, USER_NOT_VERIFIED);
      } else {
        next();
      }
    });
  } else {
    throw new Unauthorized(
      "Not authorized, token not available",
      USER_NOT_VERIFIED
    );
  }
};

const userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return next(new Unauthorized(err.message, USER_NOT_VERIFIED));
      } else {
        if (decodedToken.safeUser.role !== "basic") {
          return next(new Unauthorized("Not authorized", USER_NOT_VERIFIED));
        } else {
          req.user = {
            id: decodedToken.safeUser._id,
            username: decodedToken.safeUser.username,
            email: decodedToken.safeUser.email,
            pic: decodedToken.safeUser.pic,
          };
          next();
        }
      }
    });
  } else {
    return next(
      new Unauthorized("Not authorized, token not available", USER_NOT_VERIFIED)
    );
  }
};

module.exports = { adminAuth, userAuth };
