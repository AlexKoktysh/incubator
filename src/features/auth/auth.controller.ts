import { Response, Request } from "express";
import { bcryptService, jwtService } from "../../services";
import { LoginUserDto } from "./types";
import { UserDBType, usersQueryRepository } from "../users";
import { HttpStatuses } from "../../utils";
import { usersRepository } from "../users/repositories";

export const authController = {
    async loginUser(req: Request<{}, {}, LoginUserDto>, res: Response) {
        try {
            const { loginOrEmail, password } = req.body;
            const user = await usersRepository.findForLogin(loginOrEmail);
            if (!user?._id) {
                res.status(HttpStatuses.Unauthorized).send({
                    error: "Wrong email or password.",
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
            const { accessToken } = jwtService.generateJwtTokens({
                ...user,
                _id: user._id.toString(),
            } as unknown as UserDBType);
            res.status(HttpStatuses.Success).json({ accessToken: accessToken });
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async getUserInfo(req: Request, res: Response) {
        try {
            const user = await usersQueryRepository.findByCondition(
                "_id",
                req.userId as string,
            );
            res.status(HttpStatuses.Success).json(user);
        } catch (err) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
};
