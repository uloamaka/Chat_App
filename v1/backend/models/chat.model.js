const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    latestMessage: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ChatSchema.path("participants").validate(function (value) {
  return value.length === 2;
}, "Chat must have exactly 2 participants.");

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
