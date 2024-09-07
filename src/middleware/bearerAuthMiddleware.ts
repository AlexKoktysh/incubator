import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwt.service";
import { HttpStatuses } from "../utils";
import { usersQueryRepository } from "../features";

export const bearerAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!req.headers.authorization) {
        res.send(HttpStatuses.Unauthorized);
        return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const userByToken = jwtService.getUserByToken(token);

    if (!userByToken) {
        res.send(HttpStatuses.Unauthorized);
        return;
    }
    req.userId = (await usersQueryRepository.findByCondition(
        "_id",
        userByToken.id,
    )) as unknown as string;
    next();
};
