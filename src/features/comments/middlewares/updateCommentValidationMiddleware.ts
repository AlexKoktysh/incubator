import { NextFunction, Request, Response } from "express";
import { UpdateCommentSchema } from "../helpers/validator";

export const updateCommentValidationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = UpdateCommentSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
    });

    if (error) {
        const formattedErrors = error.details.map((err) => ({
            message: err.message,
            field: err.path.join("."),
        }));
        res.status(400).json({ errorsMessages: formattedErrors });
    } else {
        next();
    }
};
