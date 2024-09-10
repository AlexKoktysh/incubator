import { Router } from "express";
import { basicAuthMiddleware } from "../../middleware";
import { usersController } from "./users.controller";
import {
    queryValidationIdMiddleware,
    queryValidationMiddleware,
    validateBodyParams,
    validateQueryByPagination,
} from "../../utils";
import {
    CreateUserSchema,
    querySchemaByPagination,
} from "./utils/validationSchemes";
import { usersQueryRepository } from "./repositories";

export const usersRouter = Router();

usersRouter.get(
    "/",
    basicAuthMiddleware,
    validateQueryByPagination(querySchemaByPagination),
    usersController.getAllUsers,
);
usersRouter.post(
    "/",
    basicAuthMiddleware,
    validateBodyParams(CreateUserSchema),
    usersController.createUser,
);
usersRouter.delete(
    "/:id",
    basicAuthMiddleware,
    queryValidationIdMiddleware,
    queryValidationMiddleware(usersQueryRepository.findById),
    usersController.deleteUser,
);
