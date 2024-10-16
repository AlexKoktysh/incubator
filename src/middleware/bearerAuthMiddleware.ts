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
        return res.status(HttpStatuses.Unauthorized).send("Unauthorized");
    }

    const token = req.headers.authorization.split(" ")[1];
    const userByToken = jwtService.getUserByToken(token, "access");

    if (!userByToken || !token) {
        return res.status(HttpStatuses.Unauthorized).send("Unauthorized");
    }
    const user = await usersRepository.findById(userByToken.id);
    if (!user?.emailConfirmation.isConfirmed) {
        return res.status(HttpStatuses.Unauthorized).send("Unauthorized");
    }
    req.userId = user?._id.toString() as unknown as string;
    return next();
};
