import { NextFunction, Request, Response } from "express";
import { LoginUserSchema } from "../helpers/vaidator";

export const inputValidationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = LoginUserSchema.validate(req.body, {
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
