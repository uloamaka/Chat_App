const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contacts: [
      {
        type: Schema.Types.String,//reference the users emails
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;



      // type: String,
        // unique: true,
        // trim: true,