import Joi from "joi";

export const CreateUserSchema = Joi.object({
    login: Joi.string()
        .trim()
        .max(10)
        .min(3)
        .pattern(/^[a-zA-Z0-9_-]*$/)
        .required()
        .messages({
            "string.base": `"login" should be a type of 'text'`,
            "string.empty": `"login" cannot be an empty field`,
            "string.max": `"login" should have a maximum length of {#limit}`,
            "string.min": `"login" should have a minimum length of {#limit}`,
            "string.pattern": `"login" is incorrect`,
            "any.required": `"login" is a required field`,
        }),
    password: Joi.string().trim().max(20).min(6).required().messages({
        "string.empty": `"password" cannot be an empty field`,
        "string.base": `"password" should be a type of 'text'`,
        "string.max": `"password" should have a maximum length of {#limit}`,
        "string.min": `"password" should have a minimum length of {#limit}`,
        "any.required": `"password" is a required field`,
    }),
    email: Joi.string()
        .trim()
        .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .required()
        .messages({
            "string.empty": `"email" cannot be an empty field`,
            "string.base": `"email" should be a type of 'text'`,
            "object.regex": "email does not match the template",
            "string.pattern.base": "email does not match the template",
            "any.required": `"email" is a required field`,
        }),
}).unknown(true);

export const querySchema = Joi.object({
    pageNumber: Joi.number().integer(),
    pageSize: Joi.number().integer(),
    sortBy: Joi.string(),
    sortDirection: Joi.string().valid("asc", "desc"),
    searchLoginTerm: Joi.string(),
    searchEmailTerm: Joi.string(),
});
