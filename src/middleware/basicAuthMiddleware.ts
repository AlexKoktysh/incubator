import { Request, Response, NextFunction } from "express";
import basicAuth from "basic-auth";
import { HttpStatuses } from "../utils";

export const basicAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const user = basicAuth(req);
    if (user && user.name === "admin" && user.pass === "qwerty") {
        return next();
    } else {
        res.set("Authorization", `Basic realm="example"`);
        return res.status(HttpStatuses.Unauthorized).send("Unauthorized");
    }
};
