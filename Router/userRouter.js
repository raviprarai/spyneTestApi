const router = require("express").Router();
const userRouter = require("../controller/userController");
const { verifyToken,verifyTokenAndUser } = require("../middlewares/auth")
// const {uploadAddarForm,upload}=require("../../middlewares/fileUpload")
const multer = require('multer')
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
const upload = multer({storage:storage})
router.post("/userSignup", userRouter.userSignup);
router.post("/userLogin", userRouter.userLogin);
router.put("/editProfile", verifyTokenAndUser,userRouter.editProfile);
router.put("/editProfileImage", verifyTokenAndUser,upload.single('image'),userRouter.editProfileImage);
router.get("/showProfile", verifyTokenAndUser,userRouter.showProfile);
router.delete("/deleteUser", verifyTokenAndUser,userRouter.deleteUser);

router.get("/userGetPostList",verifyTokenAndUser, userRouter.userGetPostList);
router.get("/allUserList",verifyTokenAndUser, userRouter.allUserList);
router.post("/searchByUser",verifyTokenAndUser, userRouter.searchByUser);
router.post("/serachByHasttag",verifyTokenAndUser, userRouter.serachByHasttag);
router.post("/searchBypostTaxt",verifyTokenAndUser, userRouter.searchBypostTaxt);
router.post("/userCommentPost",verifyTokenAndUser, userRouter.userCommentPost);
router.post("/userCommentDelete",verifyTokenAndUser, userRouter.userCommentDelete);
router.put("/userCommentModify",verifyTokenAndUser, userRouter.userCommentModify);
router.post("/userFollowApi",verifyTokenAndUser, userRouter.userFollowApi);
router.post("/userunfollowapi",verifyTokenAndUser, userRouter.userunfollowapi);
router.post("/userLikePost",verifyTokenAndUser, userRouter.userLikePost);
router.post("/userLikeComment",verifyTokenAndUser, userRouter.userLikeComment);
router.post("/replyUserComment",verifyTokenAndUser, userRouter.replyUserComment);
router.post("/userPostView",verifyTokenAndUser, userRouter.userPostView);
router.post("/findtotalUserViewOnPost",verifyTokenAndUser, userRouter.findtotalUserViewOnPost);




module.exports = router;