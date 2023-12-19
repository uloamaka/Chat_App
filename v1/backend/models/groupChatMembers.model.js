const mongoose = require("mongoose");
const { Schema } = mongoose;

const groupChatMemberSchema = new Schema(
  {
    groupChat_id: { type: Schema.Types.ObjectId, ref: "GroupChat" },
    Participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const GroupChatMember = mongoose.model("GroupChatMember", groupChatMemberSchema);
module.exports = GroupChatMember;
