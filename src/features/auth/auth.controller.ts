import { Response, Request } from "express";
import { bcryptService, cookieService, jwtService } from "../../services";
import { LoginUserDto } from "./types";
import { UserDBType, usersQueryRepository } from "../users";
import { HttpStatuses, MailerTypeEnum } from "../../utils";
import { usersRepository } from "../users/repositories";
import {
    ConfirmUserDto,
    CreateUserDto,
    ResendingConfirmDto,
} from "../users/types";
import { usersService } from "../users/users.service";
import { constantsConfig } from "../../config";

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
            const { accessToken, refreshToken } = jwtService.generateJwtTokens({
                ...user,
            });
            cookieService.setCookie(refreshToken, res);
            await usersRepository.update({
                id: user._id.toString(),
                refreshToken,
            });
            res.status(HttpStatuses.Success).json({ accessToken: accessToken });
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async refreshToken(req: Request, res: Response) {
        try {
            const token = req.cookies[constantsConfig.refreshTokenCookieName];
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
            const { accessToken, refreshToken } = jwtService.generateJwtTokens({
                ...user,
            });
            cookieService.setCookie(refreshToken, res);
            await usersRepository.update({
                id: user._id.toString(),
                refreshToken,
            });
            res.status(HttpStatuses.Success).json({ accessToken: accessToken });
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async logout(req: Request, res: Response) {
        const token = req.cookies[constantsConfig.refreshTokenCookieName];
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
        await usersRepository.update({
            id: user._id.toString(),
            refreshToken: "",
        });
        res.status(HttpStatuses.NoContent).json("OK");
    },
    async getUserInfo(req: Request, res: Response) {
        try {
            const user = await usersQueryRepository.findByCondition(
                "_id",
                req.userId as string,
            );
            res.status(HttpStatuses.Success).json({
                email: user?.email,
                login: user?.login,
                userId: user?.id,
            });
        } catch (err) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async registerUser(req: Request<{}, {}, CreateUserDto>, res: Response) {
        const user = await usersService.create(req.body, res);
        if (user) {
            try {
                await usersService.confirm(
                    {
                        email: user.email,
                        id: user.id,
                        mailerType: MailerTypeEnum.REGISTRATION,
                    },
                    res,
                );
                res.status(HttpStatuses.NoContent).json("OK");
            } catch (err: any) {
                res.status(HttpStatuses.Error).json(err);
            }
        }
    },
    async confirmUser(req: Request<{}, {}, ConfirmUserDto>, res: Response) {
        const result = jwtService.verifyConfirmationCode(req.body.code);
        if (result.valid) {
            const user = await usersRepository.find(result.email as string);
            if (user?.emailConfirmation.isConfirmed) {
                res.status(HttpStatuses.BadRequest).json({
                    errorsMessages: [
                        {
                            field: "code",
                            message: "This user has been verified previously",
                        },
                    ],
                });
                return;
            }
            await usersRepository.update({
                id: (user as UserDBType)._id.toString(),
            });
            res.status(HttpStatuses.NoContent).json("OK");
        } else {
            res.status(HttpStatuses.BadRequest).json({
                errorsMessages: [{ field: "code", message: result.message }],
            });
        }
    },
    async resendingConfirm(
        req: Request<{}, {}, ResendingConfirmDto>,
        res: Response,
    ) {
        try {
            const user = await usersRepository.find(req.body.email);
            if (!user || user.emailConfirmation.isConfirmed) {
                res.status(HttpStatuses.BadRequest).json({
                    errorsMessages: [
                        {
                            field: "email",
                            message: "Email is already confirmed",
                        },
                    ],
                });
                return;
            }
            await usersService.confirm(
                {
                    email: user.email,
                    id: user._id.toString(),
                    mailerType: MailerTypeEnum.RESENDING_CONFIRM,
                },
                res,
            );
            res.status(HttpStatuses.NoContent).json("OK");
        } catch (err: any) {
            console.error("Send email error", err);
        }
    },
};
