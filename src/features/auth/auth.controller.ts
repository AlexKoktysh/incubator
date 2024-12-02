import { Response, Request } from "express";
import { cookieService, jwtService } from "../../services";
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
import { devicesController, devicesRepository } from "../devices";
import { constantsConfig } from "../../config";

export const authController = {
    async loginUser(req: Request<{}, {}, LoginUserDto>, res: Response) {
        try {
            const user = await usersRepository.findById(req.userId as string);
            if (!user) return;

            const { accessToken, refreshToken } = jwtService.generateJwtTokens({
                ...user,
            });
            await devicesController.create({
                userId: req.userId as string,
                token: refreshToken,
                deviceName: req.headers["user-agent"] ?? "Unknown device",
                IP: req.ip ?? "Unknown IP",
            });

            cookieService.setCookie(refreshToken, res);

            res.status(HttpStatuses.Success).json({ accessToken: accessToken });
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async refreshToken(req: Request, res: Response) {
        try {
            const user = await usersRepository.findById(req.userId as string);
            if (!user) {
                res.status(HttpStatuses.Unauthorized).json("No permissons");
                return;
            }

            const { accessToken, refreshToken } = jwtService.generateJwtTokens({
                ...user,
            });
            cookieService.setCookie(refreshToken, res);

            const meta = jwtService.getUserByToken(refreshToken, "refresh");

            if (!meta) {
                res.status(HttpStatuses.Forbidden).json("No permissons");
                return;
            }

            await devicesRepository.update({
                deviceId: meta.deviceId,
                iat: meta.iat,
            });
            res.status(HttpStatuses.Success).json({ accessToken: accessToken });
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async logout(req: Request, res: Response) {
        try {
            const token = cookieService.getCookie(
                constantsConfig.refreshTokenCookieName,
                req,
            );
            const deviceId =
                jwtService.getUserByToken(token, "refresh")?.deviceId ?? "";
            await devicesRepository.deleteById(deviceId);
            res.status(HttpStatuses.NoContent).json("OK");
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
