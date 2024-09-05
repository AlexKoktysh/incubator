import { NextFunction, Request, Response } from "express";
import { commentsCollection } from "../../../db/mongo-db";

export const queryValidationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const findComment = await commentsCollection.findOne({ id: req.params.id });
    if (!req.params.id || !findComment) {
        res.status(404).json({
            errorsMessages: [{ message: "error!!!!", field: "id" }],
        });
    } else {
        next();
    }
};
