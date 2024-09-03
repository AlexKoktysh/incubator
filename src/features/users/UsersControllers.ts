import { Response, Request } from "express";
import { CreateUserDto, QueryPaginationByUserType, UserType } from "./types";
import { getPaginationOptionsForResponse, OutputErrorsType } from "../../utils";
import { UsersMongoRepository } from "./UsersMongoRepository";
import { isUniqueUser } from "./helpers/checkUniqueUser";
import { hashPassword } from "../../services/hashPasswordService";

export const getAllUsers = async (
    req: Request<{}, {}, {}, QueryPaginationByUserType>,
    res: Response,
) => {
    try {
        const { users, totalCount } = await UsersMongoRepository.getAll(
            req.query,
        );
        const pagination = getPaginationOptionsForResponse(
            req.query,
            totalCount,
        );
        res.status(200).json({
            items: users,
            totalCount,
            ...pagination,
        });
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const createUser = async (
    req: Request<any, any, CreateUserDto>,
    res: Response<UserType | OutputErrorsType>,
) => {
    try {
        const isUnique = await isUniqueUser(req.body);
        if (isUnique) {
            res.status(400).json({
                errorsMessages: [
                    { field: "email", message: "email should be unique" },
                ],
            });
            return;
        }
        const hashedPassword = await hashPassword(req.body.password);
        const user = await UsersMongoRepository.create({
            ...req.body,
            password: hashedPassword,
        });
        res.status(201).json(user as UserType);
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const deleteUser = async (
    req: Request<{ id: string }>,
    res: Response<OutputErrorsType | string>,
) => {
    try {
        await UsersMongoRepository.del(req.params.id);
        res.status(204).json("OK");
    } catch (err: any) {
        res.status(500).json(err);
    }
};
