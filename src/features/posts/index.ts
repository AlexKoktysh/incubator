import { Router } from "express";
import { authMiddleware, bearerAuthMiddleware } from "../../middleware";
import {
    getAllPostsController,
    createPostController,
    deletePostController,
    getPostByIdController,
    updatePostController,
    getComments,
    createComment,
} from "./PostControllers";
import {
    inputValidationMiddleware,
    queryValidationMiddleware,
    validateQuery,
} from "./middlewares";
import { updateCommentValidationMiddleware } from "../comments/middlewares";

export const PostsRouter = Router();

PostsRouter.get("/", getAllPostsController);
PostsRouter.get("/:id", queryValidationMiddleware, getPostByIdController);
PostsRouter.post(
    "/",
    authMiddleware,
    inputValidationMiddleware,
    createPostController,
);
PostsRouter.put(
    "/:id",
    authMiddleware,
    queryValidationMiddleware,
    inputValidationMiddleware,
    updatePostController,
);
PostsRouter.delete(
    "/:id",
    authMiddleware,
    queryValidationMiddleware,
    deletePostController,
);

PostsRouter.get(
    "/:id/comments",
    queryValidationMiddleware,
    validateQuery,
    getComments,
);
PostsRouter.post(
    "/:id/comments",
    bearerAuthMiddleware,
    queryValidationMiddleware,
    updateCommentValidationMiddleware,
    createComment,
);
