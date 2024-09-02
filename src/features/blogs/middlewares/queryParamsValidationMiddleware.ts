import { NextFunction, Request, Response } from "express";
import { querySchema, querySchemaByBlogs } from "../helpers/validator";

export const validateQuery = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = querySchema.validate(req.query);
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

export const validateQueryByBlogs = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = querySchemaByBlogs.validate(req.query);
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
