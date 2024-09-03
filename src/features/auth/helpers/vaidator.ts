import Joi from "joi";

export const LoginUserSchema = Joi.object({
    loginOrEmail: Joi.string().trim().required().messages({
        "string.base": `"login" should be a type of 'text'`,
        "string.empty": `"login" cannot be an empty field`,
        "any.required": `"login" is a required field`,
    }),
    password: Joi.string().trim().required().messages({
        "string.empty": `"password" cannot be an empty field`,
        "string.base": `"password" should be a type of 'text'`,
        "any.required": `"password" is a required field`,
    }),
}).unknown(true);
