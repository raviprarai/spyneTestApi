const postDb=require("../model/discussion")
const {postSchema,editpostSchema}=require("../validators/allValidator")
const commonfunction = require("../middlewares/fileUpload")

exports.createPost = async (req, res) => {
    try {
        //   let { email, password } = req.body;
        const { error } = postSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            const exist = await postDb.exists({ subject: req.body.subject });
            if (exist) {
                return res
                    .status(400)
                    .json({ message: "This subject is already taken!" });
            }
            let postImage;
            if (req.file) {
                postImage = req.file.path;
                postImage = await commonfunction.uploadImage(postImage);
            }
            const result = await postDb.create({
                userId:req.user._id,
                subject:req.body.subject,
                postDate:new Date(),
                postImage:postImage || '',
                hashTag:req.body.hashTag
            });
            return res.status(200).json({
                status: 1,
                message: "post Create sucessfully",
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
exports.updatePost = async (req, res) => {
    try {
        //   let { email, password } = req.body;
        const { error } = editpostSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
        
            let postImage;
            if (req.file) {
                postImage = req.file.path;
                postImage = await commonfunction.uploadImage(postImage);
            }
            const result = await postDb.findByIdAndUpdate(req.params.id,{
                subject:req.body.subject,
                postImage:postImage || '',
                hashTag:req.body.hashTag
            },{new:true});
            return res.status(200).json({
                status: 1,
                message: "post Update sucessfully",
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
exports.deletePost=async(req,res)=>{
    try {
        const result=await postDb.findByIdAndDelete(req.params.id)
        if (!result) {
            return res.status(404).json({
                status:0,
                message:"Data Not Founded"
            })
        } else {
            return res.status(200).json({
                status:1,
                message:"Data Deleted Successfully",
                result
            }) 
        }
    } catch (error) {
        return res.status(500).json({
            status:0,
            message:error.toString()
        }) 
    }
}