import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwt.service";
import { HttpStatuses } from "../utils";
import { usersRepository } from "../features/users/repositories";

export const bearerAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!req.headers.authorization) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const userByToken = jwtService.getUserByToken(token);

    if (!userByToken) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
    }
    const user = await usersRepository.findById(userByToken.id);
    if (!user?.emailConfirmation.isConfirmed) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
    }
    req.userId = user?._id.toString() as unknown as string;
    next();
};
