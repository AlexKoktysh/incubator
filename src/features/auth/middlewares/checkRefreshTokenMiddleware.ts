import { Request, Response, NextFunction } from "express";
import { cookieService, jwtService } from "../../../services";
import { constantsConfig } from "../../../config";
import { HttpStatuses } from "../../../utils";
import { devicesQueryRepository } from "../../devices";

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

    const userMeta = jwtService.getUserByToken(token, "refresh");
    if (!userMeta) {
        res.status(HttpStatuses.Unauthorized).send("Unauthorized");
        return;
    }

    const device = await devicesQueryRepository.find(userMeta.deviceId);
    if (!device) {
        res.status(HttpStatuses.Unauthorized).send("Unauthorized");
        return;
    }

    if (device.issuedAt !== new Date(userMeta.iat * 1000).toISOString()) {
        res.status(HttpStatuses.Unauthorized).send("Unauthorized");
        return;
    }

    req.userId = userMeta.id;

    return next();
};
