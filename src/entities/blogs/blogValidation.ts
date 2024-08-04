import Joi from "joi";

export const CreateBlogSchema = Joi.object({
    name: Joi.string().max(15).required(),
    description: Joi.string().max(500).required(),
    websiteUrl: Joi.string()
        .pattern(
            new RegExp(
                "^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$",
            ),
        )
        .max(100)
        .required(),
});
