import { Response } from "express";
import { bcryptService } from "../../services";
import { HttpStatuses, OutputErrorsType } from "../../utils";
import { isUniqueUser } from "./helpers";
import { usersRepository } from "./repositories";
import { CreateUserDto, UserViewType } from "./types";

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
            if (user) {
                return user;
            } else {
                res.status(HttpStatuses.Error).json({
                    errorsMessages: [
                        {
                            field: "general",
                            message: "User creation failed",
                        },
                    ],
                });
            }
            return user;
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
            return null;
        }
    },
};
