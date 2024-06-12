const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "disscussionPost",
    },
    commentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    subject: {
      type: String,
    },
    commentDate: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: {
      type: Number,
      default: 0,
    },
    dislikedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replyComment: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        replyText: {
          type: String,
        },
        replyDate: {
          type: String,
        },
      },
    ],

  },
  { timestamps: true }
);
module.exports = mongoose.model("commentUser", commentSchema);
