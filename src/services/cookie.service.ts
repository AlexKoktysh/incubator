import { Response, Request } from "express";
import { add } from "date-fns/add";
import { constantsConfig } from "../config";

export const cookieService = {
    setCookie(token: string, response: Response) {
        response.cookie(constantsConfig.refreshTokenCookieName, token, {
            httpOnly: true,
            expires: add(new Date(), {
                seconds: constantsConfig.expiresRefreshToken,
            }),
            secure: true,
            sameSite: "strict",
        });
    },
    getCookie(cookieName: string, req: Request) {
        const cookie = req.cookies[cookieName];
        return cookie;
    },
};
