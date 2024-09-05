import { Router } from "express";
import { basicAuthMiddleware } from "../../middleware";
import { usersController } from "./users.controller";
import { validateBodyParams, validateQueryByPagination } from "../../utils";
import {
    CreateUserSchema,
    querySchemaByPagination,
} from "./utils/validationSchemes";
import { queryValidationByIdMiddleware } from "./middlewares/queryValidation";

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
    queryValidationByIdMiddleware,
    usersController.deleteUser,
);
