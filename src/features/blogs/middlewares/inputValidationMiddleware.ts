import { NextFunction, Request, Response } from "express";
import { CreateBlogSchema } from "../helpers/validator";

export const inputValidationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = CreateBlogSchema.validate(req.body, {
        abortEarly: false,
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
