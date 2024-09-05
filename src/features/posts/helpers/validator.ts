import Joi from "joi";

export const CreatePostSchema = Joi.object({
    title: Joi.string().trim().max(30).required().messages({
        "string.base": `"title" should be a type of 'text'`,
        "string.empty": `"title" cannot be an empty field`,
        "string.max": `"title" should have a minimum length of {#limit}`,
        "any.required": `"title" is a required field`,
    }),
    shortDescription: Joi.string().max(100).required().messages({
        "string.empty": `"shortDescription" cannot be an empty field`,
        "string.base": `"shortDescription" should be a type of 'text'`,
        "string.max": `"shortDescription" should have a minimum length of {#limit}`,
        "any.required": `"shortDescription" is a required field`,
    }),
    content: Joi.string().trim().max(1000).required().messages({
        "string.empty": `"content" cannot be an empty field`,
        "string.base": `"content" should be a type of 'text'`,
        "string.max": `"content" should have a minimum length of {#limit}`,
        "any.required": `"content" is a required field`,
    }),
    blogId: Joi.string().required().messages({
        "string.empty": `"blogId" cannot be an empty field`,
        "string.base": `"blogId" should be a type of 'text'`,
        "any.required": `"blogId" is a required field`,
    }),
});

export const querySchema = Joi.object({
    pageNumber: Joi.number().integer(),
    pageSize: Joi.number().integer(),
    sortBy: Joi.string(),
    sortDirection: Joi.string().valid("asc", "desc"),
});
