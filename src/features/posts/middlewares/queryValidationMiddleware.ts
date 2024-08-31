import { NextFunction, Request, Response } from "express";
import { postCollection } from "../../../db/mongo-db";

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
