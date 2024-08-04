import { Router } from "express";
import {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
} from "./postsController";
import { authMiddleware } from "../../middleware";

export const PostsRouter = Router();

PostsRouter.get("/", getAllPosts);
PostsRouter.get("/:id", getPostById);
PostsRouter.post("/", authMiddleware, createPost);
PostsRouter.put("/:id", authMiddleware, updatePost);
PostsRouter.delete("/:id", authMiddleware, deletePost);
