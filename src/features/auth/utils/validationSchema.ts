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

export const RegistrationUserSchema = Joi.object({
    login: Joi.string()
        .trim()
        .max(10)
        .min(3)
        .pattern(new RegExp("^[a-zA-Z0-9_-]*$"))
        .required()
        .messages({
            "string.base": `"login" should be a type of 'text'`,
            "string.empty": `"login" cannot be an empty field`,
            "string.max": `"login" should have a maximum length of {#limit}`,
            "string.min": `"login" should have a minimum length of {#limit}`,
            "string.pattern.base": "login does not match the template",
            "any.required": `"login" is a required field`,
        }),
    password: Joi.string().trim().max(20).min(6).required().messages({
        "string.empty": `"password" cannot be an empty field`,
        "string.base": `"password" should be a type of 'text'`,
        "string.max": `"login" should have a maximum length of {#limit}`,
        "string.min": `"login" should have a minimum length of {#limit}`,
        "any.required": `"password" is a required field`,
    }),
    email: Joi.string()
        .trim()
        .pattern(new RegExp("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$"))
        .example("example@example.com")
        .messages({
            "string.empty": `"email" cannot be an empty field`,
            "string.base": `"email" should be a type of 'text'`,
            "string.pattern.base": "email does not match the template",
        }),
}).unknown(true);

export const ConfirmationSchema = Joi.object({
    code: Joi.string().trim().required().messages({
        "string.base": `"code" should be a type of 'text'`,
        "string.empty": `"code" cannot be an empty field`,
        "any.required": `"code" is a required field`,
    }),
}).unknown(true);

export const ResendingSchema = Joi.object({
    email: Joi.string()
        .trim()
        .pattern(new RegExp("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$"))
        .example("example@example.com")
        .messages({
            "string.empty": `"email" cannot be an empty field`,
            "string.base": `"email" should be a type of 'text'`,
            "string.pattern.base": "email does not match the template",
        }),
}).unknown(true);
