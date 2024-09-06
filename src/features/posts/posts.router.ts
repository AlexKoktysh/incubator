import { Router } from "express";
import { basicAuthMiddleware, bearerAuthMiddleware } from "../../middleware";
import {
    inputValidationMiddleware,
    queryValidationMiddleware,
    validateQuery,
} from "./middlewares";
import { updateCommentValidationMiddleware } from "../comments/middlewares";

export const postsRouter = Router();

postsRouter.get("/", getAllPostsController);
postsRouter.get("/:id", queryValidationMiddleware, getPostByIdController);
postsRouter.post(
    "/",
    basicAuthMiddleware,
    inputValidationMiddleware,
    createPostController,
);
postsRouter.put(
    "/:id",
    basicAuthMiddleware,
    queryValidationMiddleware,
    inputValidationMiddleware,
    updatePostController,
);
postsRouter.delete(
    "/:id",
    basicAuthMiddleware,
    queryValidationMiddleware,
    deletePostController,
);

postsRouter.get(
    "/:id/comments",
    queryValidationMiddleware,
    validateQuery,
    getComments,
);
postsRouter.post(
    "/:id/comments",
    bearerAuthMiddleware,
    queryValidationMiddleware,
    updateCommentValidationMiddleware,
    createComment,
);
