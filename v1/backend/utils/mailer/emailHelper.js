/* eslint-disable */
require("dotenv").config();

const handlebars = require("handlebars");
const fs = require("fs");

// Read the Handlebars template
const source = fs.readFileSync(`${__dirname}/email-template.hbs`, "utf8");
const template = handlebars.compile(source);

const resetPasswordTemplate = async (username, resetLink) => {
  const message = `
    <div style="font-family: sans-serif; font-size: 16px; line-height: 1.5;">
      <p>Hi ${username},</p>
      <p>
        We received a request to reset your password. If this was you, please click the button below to proceed:
      </p>
      <p style="text-align: center;">
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 14px;">Reset Password</a>
      </p>
      <p>
        This link will expire in 1 hour for security reasons. If you didn't request this reset, please disregard this email.
      </p>
    </div>
  `;
  return message;
};
const confirmEmailTemplate = async (username) => {
  const message = `
    <div style="font-family: sans-serif; font-size: 16px; line-height: 1.5;">
      <p>Hi ${username},</p>
      <p>
        Your password has been successfully reset.
      </p>
      <p>
        If you didn't request this reset, please contact our support team immediately.
      </p>
      <p>
        Thank you for using our service!
      </p>
    </div>
  `;
  return message;
};

const contactInviteTemplate = async(senderEmail, link) =>{
    const message = `
    <div style="font-family: sans-serif; font-size: 16px; line-height: 1.5;">
      <p>Hello!</p>
      <p>
       ${senderEmail} has invited you to join chat. You need to join the chat:
      </p>
      <p style="text-align: center;">
        <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 14px;">Join now!</a>
      </p>
      <p>
        This link will expire in 7 days for security reasons. If you didn't request this reset.
      </p>
    </div>
  `;
    return message;
}

module.exports = {
  // signupUserTemplate,
  // welcomeUserTemplate,
  resetPasswordTemplate,
  confirmEmailTemplate,
  contactInviteTemplate,
};
