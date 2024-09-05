import Joi from "joi";

export const createQuerySchemaByPagination = (additionalFields: Joi.SchemaMap) => {
    return Joi.object({
        pageNumber: Joi.number().integer(),
        pageSize: Joi.number().integer(),
        sortBy: Joi.string(),
        sortDirection: Joi.string().valid("asc", "desc"),
        ...additionalFields,
    });
};
