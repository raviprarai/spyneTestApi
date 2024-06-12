const router = require("express").Router();
const postRouter = require("../controller/discussionController");
// const {uploadAddarForm,upload}=require("../../middlewares/fileUpload")
const { verifyToken,verifyTokenAndUser } = require("../middlewares/auth")

const multer = require('multer')
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
const upload = multer({storage:storage})
router.post("/createPost",verifyTokenAndUser,upload.single('image'),postRouter.createPost);
router.put("/updatePost/:id",verifyTokenAndUser,upload.single('image'),postRouter.updatePost);

router.delete("/deletePost/:id", verifyTokenAndUser,postRouter.deletePost);
// router.get("/userGetBookList",verifyTokenAndUser, userRouter.userGetBookList);
// router.get("/getOneBook/:id",verifyTokenAndUser, userRouter.getOneBook);
// router.post("/searchByBook",verifyTokenAndUser, userRouter.searchByBook);
// router.post("/addBookTransation",verifyTokenAndUser, userRouter.addBookTransation);
// router.get("/myIssueBook",verifyTokenAndUser, userRouter.myIssueBook);
// router.put("/returnBook",verifyTokenAndUser, userRouter.returnBook);


module.exports = router;