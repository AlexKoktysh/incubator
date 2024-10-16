import { Request, Response, NextFunction } from "express";
import { LoginUserDto } from "../types";
import { usersRepository } from "../../users/repositories";
import { HttpStatuses } from "../../../utils";
import { bcryptService } from "../../../services";

export const checkCredentialsMiddleware = async (
    req: Request<{}, {}, LoginUserDto>,
    res: Response,
    next: NextFunction,
) => {
    const { loginOrEmail, password } = req.body;
    const user = await usersRepository.findForLogin(loginOrEmail);
    if (!user?._id) {
        res.status(HttpStatuses.Unauthorized).send({
            error: "Wrong email or password.",
        });
        return;
    }
    if (!user.emailConfirmation.isConfirmed) {
        res.status(HttpStatuses.Unauthorized).send({
            error: "This user not confirmed",
        });
        return;
    }
    const isPasswordValid = await bcryptService.comparePassword(
        password,
        user.password,
    );
    if (!isPasswordValid) {
        res.status(HttpStatuses.Unauthorized).send({
            error: "Wrong email or password.",
        });
        return;
    }

    req.userId = user?._id.toString() as unknown as string;

    next();
};
