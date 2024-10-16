import { Request, Response, NextFunction } from "express";
import { cookieService, jwtService } from "../../../services";
import { constantsConfig } from "../../../config";
import { HttpStatuses } from "../../../utils";
import { usersRepository } from "../../users/repositories";

export const checkRefreshTokenMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = cookieService.getCookie(
        constantsConfig.refreshTokenCookieName,
        req,
    );
    if (!token) {
        res.status(HttpStatuses.Unauthorized).send("Unauthorized");
        return;
    }

    const userInToken = jwtService.getUserByToken(token, "refresh");
    if (!userInToken) {
        res.status(HttpStatuses.Unauthorized).send("Unauthorized");
        return;
    }

    const user = await usersRepository.findById(userInToken.id);
    if (!user || user.refreshToken !== token) {
        res.status(HttpStatuses.Unauthorized).send("Unauthorized");
        return;
    }

    req.userId = user?._id.toString() as unknown as string;

    return next();
};
