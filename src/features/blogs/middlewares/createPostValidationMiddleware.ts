import { NextFunction, Request, Response } from "express";
import { CreatePostSchema } from "../helpers/postsValidator";

export const createPostValidationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = CreatePostSchema.validate(req.body, {
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
