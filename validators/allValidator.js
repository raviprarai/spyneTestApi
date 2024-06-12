const Joi = require("joi");
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name : Joi.string().required(),
    dob : Joi.string().required(),
    phone : Joi.string().required(),
    gender : Joi.string().required(),
    address : Joi.string().required(),
  });
  const userLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  const userEditSchema = Joi.object({
    email: Joi.string().email(),
    name : Joi.string(),
    phone : Joi.string(),
    gender : Joi.string(),
    address : Joi.string(),
  });
  const image = Joi.object({
    profilePic: Joi.string()
});
const postSchema = Joi.object({
  hashTag: Joi.array().required(),
  postImage: Joi.string(),
  subject : Joi.string().required()
});
const editpostSchema = Joi.object({
  hashTag: Joi.array(),
  postImage: Joi.string(),
  subject : Joi.string(),
});
  module.exports = {
    userSchema,userLogin,userEditSchema,image,postSchema,editpostSchema
  
  };