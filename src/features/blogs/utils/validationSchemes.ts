import Joi from "joi";
import { createQuerySchemaByPagination } from "../../../utils";

export const CreateBlogSchema = Joi.object({
    name: Joi.string().trim().max(15).required().messages({
        "string.base": `"name" should be a type of 'text'`,
        "string.empty": `"name" cannot be an empty field`,
        "string.max": `"name" should have a minimum length of {#limit}`,
        "any.required": `"name" is a required field`,
    }),
    description: Joi.string().max(500).required().messages({
        "string.empty": `"description" cannot be an empty field`,
        "string.base": `"description" should be a type of 'text'`,
        "string.max": `"description" should have a minimum length of {#limit}`,
        "any.required": `"description" is a required field`,
    }),
    websiteUrl: Joi.string()
        .pattern(
            new RegExp(
                "^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$",
            ),
        )
        .max(100)
        .required()
        .messages({
            "string.empty": `"websiteUrl" cannot be an empty field`,
            "string.base": `"websiteUrl" should be a type of 'text'`,
            "object.regex": "websiteUrl does not match the template",
            "string.pattern.base": "websiteUrl does not match the template",
            "string.max": `"websiteUrl" should have a minimum length of {#limit}`,
            "any.required": `"websiteUrl" is a required field`,
        }),
}).unknown(true);

export const querySchemaByPaginationForBlog = createQuerySchemaByPagination({
    searchNameTerm: Joi.string(),
});
