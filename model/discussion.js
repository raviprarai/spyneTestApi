const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: String,
    },
    postImage: {
      type: String,
    },
    postDate: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    hashTag: {
      type: Array,
    },
    viewBy:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    commentBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    // likedBy: {
    //   type: Array,
    //   default: [],
    // },
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
  },
  { timestamps: true }
);
module.exports = mongoose.model("disscussionPost", PostSchema);
