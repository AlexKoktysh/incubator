import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { HttpStatuses } from "./types";

export const validateBodyParams = (bodySchema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = bodySchema.validate(req.body, {
            abortEarly: false,
        });

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
