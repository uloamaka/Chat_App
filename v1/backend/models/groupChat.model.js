const mongoose = require("mongoose");
const { Schema } = mongoose;

const groupChatSchema = new Schema(
  {
    name: { type: String },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    icon: {
      type: String,
      default:
        "https://res.cloudinary.com/dsffatdpd/image/upload/v1685691602/baca/logo_aqssg3.jpg",
    },
    status: { type: String },
    is_admin: [{ type: Schema.Types.ObjectId, ref: "User" }],
    Participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const GroupChat = mongoose.model("GroupChat", groupChatSchema);
module.exports = GroupChat;
