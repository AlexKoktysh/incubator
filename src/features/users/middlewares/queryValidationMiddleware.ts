import { NextFunction, Request, Response } from "express";
import { usersCollection } from "../../../db/mongo-db";
import { querySchema } from "../helpers/vaidator";

export const queryValidationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const findUser = await usersCollection.findOne({ id: req.params.id });
    if (!req.params.id || !findUser) {
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
        res.status(400).json({ errorsMessages: formattedErrors });
    } else {
        next();
    }
};
