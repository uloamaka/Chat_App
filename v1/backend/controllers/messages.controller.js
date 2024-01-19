const Message = require("../models/message.model");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");

const { ResourceNotFound, BadRequest } = require("../errors/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  INVALID_REQUEST_PARAMETERS,
} = require("../errors/httpErrorCodes");

const allMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate({ path:"sender", select:"username pic email"})
    .populate({ path:"chat"});
  if (!messages) {
    throw new ResourceNotFound("No Message found", RESOURCE_NOT_FOUND);
  }
  res.ok(messages);
};

// const sendMessage = async (req, res) => {
//   const { content, chatId } = req.body;
//   if (!content || !chatId) {
//     throw new BadRequest(
//       "No content or chatId passed!",
//       INVALID_REQUEST_PARAMETERS
//     );
//   }

//   let newMessage = {
//     sender: req.user.id,
//     content: content,
//     chat: chatId,
//   };

//   let message = await Message.create(newMessage);

//   message = await message.populate("sender", "name pic").execPopulate();
//   message = await message.populate("chat").execPopulate();
//   message = await User.populate(message, {
//     path: "chat.participants",
//     select: "name pic email",
//   });

//   await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

//   res.ok(message);
// };
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    throw new BadRequest(
      "No content or chatId passed!",
      INVALID_REQUEST_PARAMETERS
    );
  }

  // Create message
  //  const sentMessage = await Message.create({
  //     sender: req.user.id,
  //     content,
  //     chat: chatId,
  //   });

  //   // Populate in a single query  e.g;  "await Story.find().populate({ path: 'fans', select: 'email' });""
  //   const populatedMessage = await Message.find({ chat: sentMessage._id })
  //     .populate({ path: "sender", select: "username pic email" })
  //     .populate({ path: "chat" })
  //     .populate({ path: "chat.participants", select: "username pic email" })
  //     .exec();

  const sentMessage = await Message.create({
    sender: req.user.id,
    content,
    chat: chatId,
  });

  // Populate the fields in the created message
  const populatedMessage = await Message.populate(sentMessage, [
    { path: "sender", select: "username pic email" },
    { path: "chat" },
    { path: "chat.participants", select: "username pic email" },
  ]);

  // Update chat
   await Chat.findByIdAndUpdate(chatId, { latestMessage: populatedMessage });

  res.ok(populatedMessage);
};

module.exports = { allMessages, sendMessage };

  // console.log(sentMessage._id);
  // let msgId = sentMessage._id;
  // const objectWithoutNew = msgId.replace(/^new\s+/i, "");
  // const extractedObjectId = eval(`(${objectWithoutNew})`);
  // console.log(extractedObjectId);