import { Router } from "express";
import {
    getAllBlogsController,
    getBlogById,
    createBlogController,
    updateBlogController,
    deleteBlogController,
} from "./BlogControllers";
import { authMiddleware } from "../../middleware";

export const BlogsRouter = Router();

BlogsRouter.get("/", getAllBlogsController);
BlogsRouter.get("/:id", getBlogById);
BlogsRouter.post("/", authMiddleware, createBlogController);
BlogsRouter.put("/:id", authMiddleware, updateBlogController);
BlogsRouter.delete("/:id", authMiddleware, deleteBlogController);
