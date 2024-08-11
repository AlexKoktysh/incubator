import { Router } from "express";
import { authMiddleware } from "../../middleware";
import {
    getAllPostsController,
    createPostController,
    deletePostController,
    getPostByIdController,
    updatePostController,
} from "./PostControllers";

export const PostsRouter = Router();

PostsRouter.get("/", getAllPostsController);
PostsRouter.get("/:id", getPostByIdController);
PostsRouter.post("/", authMiddleware, createPostController);
PostsRouter.put("/:id", authMiddleware, updatePostController);
PostsRouter.delete("/:id", authMiddleware, deletePostController);
