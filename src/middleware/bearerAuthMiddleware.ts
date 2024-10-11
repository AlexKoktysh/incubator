import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwt.service";
import { HttpStatuses } from "../utils";
import { usersRepository } from "../features/users/repositories";
import { constantsConfig } from "../config";

export const bearerAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!req.headers.authorization) {
        return res.status(HttpStatuses.Unauthorized).send("Unauthorized");
    }

    const token = req.headers.authorization.split(" ")[1];
    const userByToken = jwtService.getUserByToken(token, "access");

    if (!userByToken || !token) {
        const refresh = req.cookies[constantsConfig.refreshTokenCookieName];
        const userInToken = jwtService.getUserByToken(refresh, "refresh");
        if (!userInToken)
            return res.status(HttpStatuses.Unauthorized).send("Unauthorized");
        const user = await usersRepository.findById(userInToken.id);
        if (refresh !== user?.refreshToken)
            return res.status(HttpStatuses.Unauthorized).send("Unauthorized");
        return res.status(HttpStatuses.Unauthorized).send("Unauthorized");
    }
    const user = await usersRepository.findById(userByToken.id);
    if (!user?.emailConfirmation.isConfirmed) {
        return res.status(HttpStatuses.Unauthorized).send("Unauthorized");
    }
    req.userId = user?._id.toString() as unknown as string;
    return next();
};
