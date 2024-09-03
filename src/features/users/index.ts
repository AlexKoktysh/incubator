import { Router } from "express";
import { getAllUsers, createUser, deleteUser } from "./UsersControllers";
import { authMiddleware } from "../../middleware";
import {
    inputValidationMiddleware,
    queryValidationMiddleware,
    validateQuery,
} from "./middlewares";

export const UsersRouter = Router();

UsersRouter.get("/", authMiddleware, validateQuery, getAllUsers);
UsersRouter.post("/", authMiddleware, inputValidationMiddleware, createUser);
UsersRouter.delete(
    "/:id",
    authMiddleware,
    queryValidationMiddleware,
    deleteUser,
);
