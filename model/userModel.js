const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
            //   required: true,
            mix: 10,
        },
        password: {
            type: String,
        },
        dob: {
            type: String,
        },
        gender: {
            type: String,
        },
        address: {
            type: String,
        },
        profilePic: {
            type: String,
        },
        followers: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
          followings: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
          userlikePostId: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "disscussionPost",
            },
          ],
        isUser: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
