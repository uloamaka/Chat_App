const mongoose = require("mongoose");
const { Schema } = mongoose;

const inviteSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    receiver: { type: String },
    inviteStatus: { type: String, enum: ["accepted", "pending"] , default: "pending"},
    inviteToken: { type: String },
  },
  { timestamps: true }
);

const InviteFriend = mongoose.model("InviteFriend", inviteSchema);
module.exports = InviteFriend;
