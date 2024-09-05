import { NextFunction, Request, Response } from "express";
import { postCollection } from "../../../db/mongo-db";
import { querySchema } from "../helpers/validator";

export const queryValidationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const findPost = await postCollection.findOne({ id: req.params.id });
    if (!req.params.id || !findPost) {
        res.status(404).json({
            errorsMessages: [{ message: "error!!!!", field: "id" }],
        });
    } else {
        next();
    }
};

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
        res.status(404).json({ errorsMessages: formattedErrors });
    } else {
        next();
    }
};
