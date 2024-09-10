import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { FindEntityFunction, HttpStatuses } from "./types";

export const validateBodyParams = <T>(
    bodySchema: Schema,
    findEntity?: FindEntityFunction<T>,
    field?: string,
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let formattedErrors = [];
        const { error } = bodySchema.validate(req.body, {
            abortEarly: false,
        });

        if (findEntity && field) {
            const entity = await findEntity(req.body[field]);
            !entity &&
                formattedErrors.push({ message: "Entity not found", field });
        }

        if (error) {
            formattedErrors.push(
                ...error.details.map((err) => ({
                    message: err.message,
                    field: err.path.join("."),
                })),
            );
            res.status(HttpStatuses.BadRequest).json({
                errorsMessages: formattedErrors,
            });
        } else {
            next();
        }
    };
};
