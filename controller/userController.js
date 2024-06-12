const userDb = require("../model/userModel");
const postDb = require("../model/discussion");
const userComment = require("../model/userComment")
const { userSchema, userLogin, userEditSchema, image } = require("../validators/allValidator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const commonfunction = require("../middlewares/fileUpload");
const { status } = require("init");
exports.userSignup = async (req, res) => {
    try {
        //   let { email, password } = req.body;
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            const exist = await userDb.exists({ email: req.body.email });
            if (exist) {
                return res
                    .status(400)
                    .json({ message: "This email is already taken!" });
            }
            const existData = await userDb.exists({ phone: req.body.phone });
            if (existData) {
                return res
                    .status(400)
                    .json({ message: "This Phone is already taken!" });
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const result = await userDb.create({
                name: req.body.name,
                dob: req.body.dob,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                address: req.body.address,
                password: hashedPassword,
            });

            return res.status(200).json({
                status: 1,
                message: "User Signup sucessfully",
                result
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const { error } = userLogin.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            let userResult = await userDb.findOne({ email: req.body.email });
            if (!userResult) {
                return res.status(404).json({
                    status: 0,
                    message: "Email Not found",
                });
            } else {
                let passCheck = bcrypt.compareSync(
                    req.body.password,
                    userResult.password
                );
                if (passCheck == false) {
                    return res.status(401).json({
                        status: 0,
                        message: "Incorrect password.",
                    });
                } else {
                    let dataToken = {
                        _id: userResult._id,
                        isUser: userResult.isUser,
                    };
                    let token = jwt.sign(dataToken, "test1234", {
                        expiresIn: "30d",
                    });
                    return res.status(200).json({
                        status: 1,
                        message: "User Login Successfully.....",
                        result: userResult,
                        token,
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 0,
            message: error.toString(),
        });
    }
};
exports.editProfile = async (req, res) => {
    try {
        const { error } = userEditSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            const result = await userDb.findById(req.user._id);
            if (!result) {
                return res.status(404).json({
                    status: 0,
                    message: "User Not Founded"
                })
            } else {
                const upadatedata = await userDb.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
                return res.status(200).json({
                    status: 1,
                    message: "Update Successfully",
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString()
        })
    }
}
exports.editProfileImage = async (req, res) => {
    try {
        const { error } = image.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            const result = await userDb.findById(req.user._id);
            if (!result) {
                return res.status(404).json({
                    status: 0,
                    message: "User Not Founded"
                })
            } else {
                let profilePic = req.file.path
                req.body.profilePic = await commonfunction.uploadImage(profilePic);
                req.body.profilePic = req.body.profilePic
                const upadatedata = await userDb.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
                return res.status(200).json({
                    status: 1,
                    message: "Update Successfully",
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString()
        })
    }
}
exports.showProfile = async (req, res) => {
    try {
        const result = await userDb.findById(req.user._id)
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "User Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "User Data Founded",
                result
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
}
exports.deleteUser = async (req, res) => {
    try {
        const result = await userDb.findByIdAndDelete(req.user._id)
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "User Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "User Data Deleted Successfully",
                result
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
}
exports.userGetPostList = async (req, res) => {
    try {
        const result = await postDb.find().sort("-createdAt").populate("userId viewBy commentBy likedBy")
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "Data Founded Successfully",
                result
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
}
exports.allUserList = async (req, res) => {
    try {
        const result = await userDb.find()
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "Data Founded Successfully",
                result
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
}
exports.searchByUser = async (req, res) => {
    try {
        const key = req.body.key;
        const data = {
            $or: [
                { name: { $regex: new RegExp(key, "i") } },
                { email: { $regex: new RegExp(key, "i") } },
                { phone: { $regex: new RegExp(key, "i") } },
            ],
        };
        const result = await userDb.find(data);
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "User Founded Successfully",
                result
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString()
        })
    }
}
exports.serachByHasttag = async (req, res) => {
    try {
        const key = req.body.key;
        const data = {
            $or: [
                { hashTag: { $in: [new RegExp(key, "i")] } }
            ],
        };
        const result = await postDb.find(data);
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "Data Founded Successfully",
                result
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
}
exports.searchBypostTaxt = async (req, res) => {
    try {
        const key = req.body.key;
        const data = {
            $or: [
                { subject: { $regex: new RegExp(key, "i") } }
            ],
        };
        const result = await postDb.find(data);
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "Data Founded Successfully",
                result
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString()
        })
    }
}
exports.userCommentPost = async (req, res) => {
    try {
        const postData = await postDb.findById(req.body.postId)
        if (!postData) {
            return res.status(404).json({
                status: 0,
                message: "Post Not Founded"
            })
        }
        const result = await userComment.create({
            postId: req.body.postId,
            commentBy: req.user._id,
            subject: req.body.subject,
            commentDate: new Date()
        });
        await postDb.findByIdAndUpdate(
            postData._id,
            { $push: { commentBy: req.user._id } },
            { new: true }
        );
        return res.status(200).json({
            status: 1,
            message: "User comment sucessfully",
            result
        });

    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};
exports.userCommentDelete = async (req, res) => {
    try {
        const result = await userComment.findOne({ $and: [{ commentBy: req.user._id }, { _id: req.body.id }] })
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded",
            });
        }
        await postDb.findByIdAndUpdate({
            _id:
                result.postId
        },
            { $pull: { commentBy: req.user._id } },
            { new: true }
        );
        const deleteComment = await userComment.findByIdAndDelete({ _id: result._id })
        return res.status(200).json({
            status: 1,
            message: "User delete comment sucessfully"
        });

    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};

exports.userCommentModify = async (req, res) => {
    try {
        const result = await userComment.findOne({ $and: [{ commentBy: req.user._id }, { _id: req.body.id }] })
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded",
            });
        }
        const updateComment = await userComment.findByIdAndUpdate({ _id: result._id }, { $set: req.body }, { new: true })
        return res.status(200).json({
            status: 1,
            message: "User Modify comment sucessfully"
        });

    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};

exports.userFollowApi = async (req, res) => {
    if (req.body.followers !== req.user._id) {
        try {
            const followers = req.body.followers;
            const user = await userDb.findById({ _id: req.user._id });
            const sa = user._id;
            const currentUser = await userDb.findById(followers);
            if (!user.followings.includes(followers)) {
                await user.updateOne({ $push: { followings: req.body.followers } });
                await currentUser.updateOne({
                    $push: { followers: sa },
                });
                return res.status(200).json({
                    status: 1,
                    message: "User Follow User Successfully"
                });
            } else {
                return res.status(409).json({
                    status: 1,
                    message: "you already follow this User",
                });
            }
        } catch (err) {
            return res.status(500).json({
                status: 0,
                message: err.toString(),
            });
        }
    } else {
        return res.status(409).json({
            status: 0,
            message: "you cant follow yourself",
        });
    }
};
exports.userunfollowapi = async (req, res) => {
    if (req.body.followers !== req.user._id) {
        try {
            const followers = req.body.followers;
            const user = await userDb.findById({ _id: req.user._id });
            const sa = user._id;
            const currentUser = await userDb.findById(followers);
            if (user.followings.includes(req.body.followers)) {
                await user.updateOne({ $pull: { followings: req.body.followers } });
                await currentUser.updateOne({ $pull: { followers: sa } });
                return res.status(200).json({
                    status: 1,
                    message: "User has been Unfollowed Successfully.",
                });
            } else {
                return res.status(409).json({
                    status: 0,
                    message: "You don't follow this user",
                });
            }
        } catch (err) {
            return res.status(500).json({
                status: 0,
                message: err.toString(),
            });
        }
    } else {
        return res.status(409).json({
            status: 0,
            message: "You Can't Unfollow Yourself",
        });
    }
};

exports.userLikePost = async (req, res) => {
    try {
        const postId = req.body.postId;
        const user = await userDb.findById(req.user._id);
        const post = await postDb.findById(postId);
        if (!post) {
            return res.status(404).json({
                status: 0,
                message: "Post Not Founded",
            });
        } else {
            if (!post.likedBy.includes(user._id) && !user.userlikePostId.includes(postId)) {
                const result = await postDb.findByIdAndUpdate(
                    postId,
                    { $inc: { likes: 1 }, $push: { likedBy: req.user._id } },
                    { new: true }
                );
                await postDb.findByIdAndUpdate(
                    postId,
                    { $pull: { dislikedBy: req.user._id } },
                    { new: true }
                );
                await user.updateOne({
                    $push: { userlikePostId: req.body.postId },
                });

                return res.status(200).json({
                    status: 1,
                    message: "User Likes User Post Successfully"
                });
            } else {
                return res.status(409).json({
                    status: 0,
                    message: "you already likes this post",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString(),
        });
    }
};

exports.userLikeComment = async (req, res) => {
    try {
        const commentId = req.body.commentId;
        const user = await userDb.findById(req.user._id);
        const post = await userComment.findById(commentId);
        if (!post) {
            return res.status(404).json({
                status: 0,
                message: "Post Not Founded",
            });
        } else {
            if (!post.likedBy.includes(user._id)) {
                const result = await userComment.findByIdAndUpdate(
                    commentId,
                    { $inc: { likes: 1 }, $push: { likedBy: req.user._id } },
                    { new: true }
                );
                await userComment.findByIdAndUpdate(
                    commentId,
                    { $pull: { dislikedBy: req.user._id } },
                    { new: true }
                );
                return res.status(200).json({
                    status: 1,
                    message: "User Likes Comment Post Successfully"
                });
            } else {
                return res.status(409).json({
                    status: 0,
                    message: "you already likes this post",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString(),
        });
    }
};
exports.replyUserComment = async (req, res) => {
    try {
        const result = await userComment.findById(req.body.commentId)
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded",
            });
        }
        const updateComment = await userComment.findByIdAndUpdate({ _id: result._id }, { replyComment:{
            userId:req.user._id,
            replyText:req.body.replyText,
            replyDate:new Date()
        } }, { new: true })
        return res.status(200).json({
            status: 1,
            message: "User reply comment sucessfully"
        });

    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};

exports.userPostView = async (req, res) => {
    try {
        const postData = await postDb.findById(req.body.postId)
        if (!postData) {
            return res.status(404).json({
                status: 0,
                message: "Post Not Founded"
            })
        }
        await postDb.findByIdAndUpdate(
            postData._id,
            { $push: { viewBy: req.user._id } },
            { new: true }
        );
        return res.status(200).json({
            status: 1,
            message: "User View Post sucessfully"
        });

    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};

exports.findtotalUserViewOnPost = async (req, res) => {
    try {
        const result = await postDb.findOne({ $and: [{ userId: req.user._id }, { _id: req.body.postId }] })
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded",
            });
        }
        return res.status(200).json({
            status: 1,
            message: "Data founded sucessfully",
            result:result.viewBy.length
        });

    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};