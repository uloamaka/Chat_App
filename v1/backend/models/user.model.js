const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dsffatdpd/image/upload/v1685691602/baca/logo_aqssg3.jpg",
    },
    role: {
      type: String,
      enum: ["admin", "basic"],
      default: "basic",
    },
    authType: {
      type: String,
      enum: ["google", "form"],
      default: "form",
    },
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { require: true }
);
const User = mongoose.model("User", UserSchema);
module.exports = User;
