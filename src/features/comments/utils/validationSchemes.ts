import Joi from "joi";

export const UpdateCommentSchema = Joi.object({
    content: Joi.string().trim().max(300).min(20).required().messages({
        "string.base": `"content" should be a type of 'text'`,
        "string.empty": `"content" cannot be an empty field`,
        "string.max": `"content" should have a maximum length of {#limit}`,
        "string.min": `"content" should have a minimum length of {#limit}`,
        "any.required": `"content" is a required field`,
    }),
});
