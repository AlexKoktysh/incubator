import { Response, Request } from "express";
import { add } from "date-fns/add";
import { bcryptService, jwtService, nodemailerService } from "../../services";
import { LoginUserDto } from "./types";
import { UserDBType, usersQueryRepository } from "../users";
import { HttpStatuses } from "../../utils";
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
    async registerUser(req: Request<{}, {}, CreateUserDto>, res: Response) {
        const user = await usersService.create(req.body, res);
        if (user) {
            try {
                const confirmationCode =
                    await jwtService.generateConfirmationCode(user.email);
                await usersRepository.update({
                    id: user.id,
                    confirmationCode,
                });
                const message = `
                    <h1>Thank for your registration</h1>
                    <p>To finish registration please follow the link below:
                        <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
                    </p>
                `;
                await nodemailerService.sendEmail({
                    email: user.email,
                    message,
                    subject: "registration",
                });
                res.status(HttpStatuses.NoContent).json("OK");
            } catch (err: any) {
                console.error("Send email error", err);
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
                isConfirmed: true,
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
            const confirmationCode = await jwtService.generateConfirmationCode(
                user.email,
            );
            await usersRepository.update({
                id: user._id.toString(),
                confirmationCode,
                expirationDate: add(new Date(), {
                    minutes: constantsConfig.EXPIRES_TIME,
                }),
            });
            const message = `
                    <h1>Thank for your registration</h1>
                    <p>To finish registration please follow the link below:
                        <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
                    </p>
                `;
            await nodemailerService.sendEmail({
                email: user.email,
                message,
                subject: "registration",
            });
            res.status(HttpStatuses.NoContent).json("OK");
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
};
