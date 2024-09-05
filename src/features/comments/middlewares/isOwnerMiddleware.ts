import { NextFunction, Request, Response } from "express";
import { commentsCollection } from "../../../db/mongo-db";

export const isOwnerMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const findComment = await commentsCollection.findOne({ id: req.params.id });
    findComment?.commentatorInfo.userId;
    const userId = req.userId;
    if (!findComment) {
        res.status(404).json({
            errorsMessages: [{ message: "error!!!!", field: "id" }],
        });
        return;
    }
    if (findComment.commentatorInfo.userId !== userId) {
        res.status(403).json("No permission");
    } else {
        next();
    }
};
