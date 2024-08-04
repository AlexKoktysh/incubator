import Joi from "joi";

enum AvailableResolutionsEnum {
    "P144" = "P144",
    "P240" = "P240",
    "P360" = "P360",
    "P480" = "P480",
    "P720" = "P720",
    "P1080" = "P1080",
    "P1440" = "P1440",
    "P2160" = "P2160",
}

export const CreateVideoSchema = Joi.object({
    title: Joi.string().max(40).required(),
    author: Joi.string().max(20).required(),
    availableResolutions: Joi.array().items(
        Joi.string().valid(...Object.values(AvailableResolutionsEnum)),
    ),
});

export const UpdateVideoSchema = Joi.object({
    title: Joi.string().max(40).required(),
    author: Joi.string().max(20).required(),
    availableResolutions: Joi.array()
        .items(Joi.string().valid(...Object.values(AvailableResolutionsEnum)))
        .required(),
    canBeDownloaded: Joi.boolean().default(false),
    minAgeRestriction: Joi.number()
        .integer()
        .min(1)
        .max(18)
        .allow(null)
        .default(null),
    publicationDate: Joi.string().required(),
});
