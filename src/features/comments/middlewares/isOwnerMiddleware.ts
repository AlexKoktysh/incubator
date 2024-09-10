import { NextFunction, Request, Response } from "express";
import { commentsQueryRepository } from "../repositories";
import { HttpStatuses } from "../../../utils";

export const isOwnerMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const findComment = await commentsQueryRepository.find(req.params.id);

    if (
        findComment?.commentatorInfo.userId.toString() !==
        (req.userId as string)
    ) {
        res.status(HttpStatuses.Forbidden).json("No permission");
    } else {
        next();
    }
};
