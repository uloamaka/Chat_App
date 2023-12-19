/* eslint-disable */
require("dotenv").config();
const nodemailer = require("nodemailer");
const {
  // signupUserTemplate,
  // welcomeUserTemplate,
  resetPasswordTemplate,
  confirmEmailTemplate,
  contactInviteTemplate,
} = require("./emailHelper");
// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const emailSent = (error, info) => {
  if (error) {
    console.log("Error occurred:", error.message);
  } else {
    console.log("Email sent:", info.response);
  }
};



async function resetPasswordEmail(email, username, resetLink) {
  const resetPassword = await resetPasswordTemplate( username, resetLink);
  const options = {
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Your Password",
    html: resetPassword,
  };
  transporter.sendMail(options, emailSent);
}
async function confirmationEmail(email, username) {
  const confirmReset = await confirmEmailTemplate(username);
  const options = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset Confirmation",
    html: confirmReset,
  };
  transporter.sendMail(options, emailSent);
}

async function newContactEmail(email, senderEmail, link) {
  const invitedLink = await contactInviteTemplate(senderEmail, link);
  const options = {
    to: email,
    subject: `Your are invited to Chat-app`,
    html: invitedLink,
  };
  transporter.sendMail(options, emailSent);
}

// // this will be sent after contact accepted successfully
// async function sendNewContactAcceptedEmail(
//   yourName,
//   partnerName,
//   partnerEmail,
// ) {
//   const options = {
//     to: partnerEmail,
//     subject: `${partnerName} has accepted your invitation`,
//     template: "new-kyc-verification-accepted",
//     variables: {
//       yourName,
//       partnerName,
//       partnerEmail,
//     },
//   };

//   await sendMail(options);
// }

// /////////////// Advance  ///////////////////

// // Subscribe user to NewsLetter
// async function subscribeToNewsLetter({ email, name }) {
//   const options = {
//     email,
//     name,
//     listName: "newsletter",
//   };

//   await addToMailingList(options);
// }

// // unsubscribe user From NewsLetter
// async function unsubscribeFromNewsLetter(email) {
//   const options = {
//     email,
//     listName: "newsletter",
//   };

//   await removeFromMailingList(options);
// }

module.exports = {
  // userSignupEmail,
  // userWelcomeNotification,
  resetPasswordEmail,
  newContactEmail,
  confirmationEmail,
  //   sendNewContactAcceptedEmail,

  //   subscribeToNewsLetter,
  //   unsubscribeFromNewsLetter,
};
