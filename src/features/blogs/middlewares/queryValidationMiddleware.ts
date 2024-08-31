import { NextFunction, Request, Response } from "express";
import { blogCollection } from "../../../db/mongo-db";

export const queryValidationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const findBlog = await blogCollection.findOne({ id: req.params.id });
    if (!req.params.id || !findBlog) {
        res.status(404).json({
            errorsMessages: [{ message: "error!!!!", field: "id" }],
        });
    } else {
        next();
    }
};
