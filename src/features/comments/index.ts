import { Router } from "express";

import {
    getCommentById,
    deleteCommentController,
    updateCommentController,
} from "./CommentsController";
import {
    isOwnerMiddleware,
    queryValidationMiddleware,
    updateCommentValidationMiddleware,
} from "./middlewares";
import { bearerAuthMiddleware } from "../../middleware";

export const CommentsRouter = Router();

CommentsRouter.get("/:id", queryValidationMiddleware, getCommentById);
CommentsRouter.delete(
    "/:id",
    bearerAuthMiddleware,
    queryValidationMiddleware,
    isOwnerMiddleware,
    deleteCommentController,
);
CommentsRouter.put(
    "/:id",
    bearerAuthMiddleware,
    queryValidationMiddleware,
    isOwnerMiddleware,
    updateCommentValidationMiddleware,
    updateCommentController,
);
