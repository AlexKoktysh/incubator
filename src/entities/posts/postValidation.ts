import Joi from "joi";

export const CreatePostSchema = Joi.object({
    title: Joi.string().max(30).required(),
    shortDescription: Joi.string().max(100).required(),
    content: Joi.string().max(1000).required(),
    blogId: Joi.string().required(),
});
