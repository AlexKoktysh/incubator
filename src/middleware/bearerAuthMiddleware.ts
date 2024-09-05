import { Request, Response, NextFunction } from "express";
import { getUserByToken } from "../services/jwtService";
import { UsersMongoRepository } from "../features/users/UsersMongoRepository";

declare global {
    namespace Express {
        export interface Request {
            userId: string | null;
        }
    }
}

export const bearerAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!req.headers.authorization) {
        res.send(401);
        return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const userByToken = getUserByToken(token);

    if (!userByToken) {
        res.send(401);
        return;
    }

    req.userId = (await UsersMongoRepository.find(
        userByToken.id,
    )) as unknown as string;
    next();
};
