import { Router } from "express";
import { authMiddleware } from "../../middleware";
import {
    getAllPostsController,
    createPostController,
    deletePostController,
    getPostByIdController,
    updatePostController,
} from "./PostControllers";
import {
    inputValidationMiddleware,
    queryValidationMiddleware,
} from "./middlewares";

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
