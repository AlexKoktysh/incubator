import { Response } from "express";
import { add } from "date-fns/add";
import {
    bcryptService,
    createmailerService,
    jwtService,
    nodemailerService,
} from "../../services";
import { HttpStatuses, OutputErrorsType } from "../../utils";
import { isUniqueUser } from "./helpers";
import { usersRepository } from "./repositories";
import { ConfirmUserType, CreateUserDto, UserViewType } from "./types";
import { constantsConfig } from "../../config";

export const usersService = {
    async create(
        userDto: CreateUserDto,
        res: Response<UserViewType | OutputErrorsType>,
    ): Promise<UserViewType | null> {
        try {
            const isUnique = await isUniqueUser(userDto);
            if (isUnique) {
                res.status(HttpStatuses.BadRequest).json({
                    errorsMessages: [
                        {
                            field:
                                isUnique.email === userDto.email
                                    ? "email"
                                    : "login",
                            message: "email should be unique",
                        },
                    ],
                });
                return null;
            }
            const hashedPassword = await bcryptService.hashPassword(
                userDto.password,
            );
            const user = await usersRepository.create({
                ...userDto,
                password: hashedPassword,
            });
            !user &&
                res.status(HttpStatuses.Error).json({
                    errorsMessages: [
                        {
                            field: "general",
                            message: "User creation failed",
                        },
                    ],
                });
            return user;
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
            return null;
        }
    },
    async confirm({ email, id, mailerType }: ConfirmUserType, res: Response) {
        try {
            const confirmationCode =
                await jwtService.generateConfirmationCode(email);
            await usersRepository.update({
                id,
                confirmationCode,
                expirationDate: add(new Date(), {
                    minutes: constantsConfig.EXPIRES_TIME,
                }),
            });
            const message = createmailerService.createMessage({
                code: confirmationCode,
                type: mailerType,
            });
            await nodemailerService.sendEmail({
                email,
                message,
                subject: mailerType,
            });
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
};
