import { Response, Request } from "express";
import {
    CreateUserDto,
    ListUsersViewType,
    QueryPaginationByUserType,
    UserViewType,
} from "./types";
import {
    getPaginationOptionsForResponse,
    HttpStatuses,
    OutputErrorsType,
    setDefaultQueryParams,
} from "../../utils";
import { isUniqueUser } from "./helpers";
import { usersQueryRepository, usersRepository } from "./repositories";
import { bcryptService } from "../../services";

export const usersController = {
    async getAllUsers(
        req: Request<{}, {}, {}, QueryPaginationByUserType>,
        res: Response<ListUsersViewType>,
    ) {
        try {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                searchEmailTerm,
                searchLoginTerm,
            } = {
                ...setDefaultQueryParams(req.query),
                searchEmailTerm: req.query.searchEmailTerm ?? "",
                searchLoginTerm: req.query.searchLoginTerm ?? "",
            };
            const { users, totalCount } = await usersQueryRepository.getMany({
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                searchEmailTerm,
                searchLoginTerm,
            });
            const pagination = getPaginationOptionsForResponse(
                req.query,
                totalCount,
            );
            res.status(HttpStatuses.Success).json({
                items: users,
                totalCount,
                ...pagination,
            });
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },

    async createUser(
        req: Request<{}, {}, CreateUserDto>,
        res: Response<UserViewType | OutputErrorsType>,
    ) {
        try {
            const isUnique = await isUniqueUser(req.body);
            if (isUnique) {
                res.status(HttpStatuses.BadRequest).json({
                    errorsMessages: [
                        { field: "email", message: "email should be unique" },
                    ],
                });
                return;
            }
            const hashedPassword = await bcryptService.hashPassword(
                req.body.password,
            );
            const user = await usersRepository.create({
                ...req.body,
                password: hashedPassword,
            });
            if (user) {
                res.status(HttpStatuses.Created).json(user);
            } else {
                res.status(HttpStatuses.Error).json({
                    errorsMessages: [
                        { field: "general", message: "User creation failed" },
                    ],
                });
            }
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },

    async deleteUser(
        req: Request<{ id: string }>,
        res: Response<OutputErrorsType | string>,
    ) {
        try {
            await usersRepository.delete(req.params.id);
            res.status(HttpStatuses.NoContent).json("OK");
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
};
