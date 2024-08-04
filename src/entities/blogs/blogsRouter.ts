import { Router } from "express";
import {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
} from "./blogsController";
import { authMiddleware } from "../../middleware";

export const BlogsRouter = Router();

BlogsRouter.get("/", getAllBlogs);
BlogsRouter.get("/:id", getBlogById);
BlogsRouter.post("/", authMiddleware, createBlog);
BlogsRouter.put("/:id", authMiddleware, updateBlog);
BlogsRouter.delete("/:id", authMiddleware, deleteBlog);
