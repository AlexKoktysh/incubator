import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

import { FindEntityFunction, HttpStatuses } from "./types";

export const validateQueryByPagination = (validateSchema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = validateSchema.validate(req.query);
        if (error) {
            const formattedErrors = error.details.map((err) => ({
                message: err.message,
                field: err.path.join("."),
            }));
            res.status(HttpStatuses.BadRequest).json({
                errorsMessages: formattedErrors,
            });
        } else {
            next();
        }
    };
};

export const queryValidationMiddleware = <T>(
    findEntity: FindEntityFunction<T>,
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            res.status(HttpStatuses.NotFound).json({
                errorsMessages: [
                    { message: "Please, check you url address.", field: "id" },
                ],
            });
            return;
        }

        const entity = await findEntity(req.params.id);
        if (!entity) {
            res.status(HttpStatuses.NotFound).json({
                errorsMessages: [
                    { message: "Not found entity by id.", field: "id" },
                ],
            });
            return;
        }

        next();
    };
};
