import { Router } from "express";
import {
    getAllBlogsController,
    getBlogById,
    createBlogController,
    updateBlogController,
    deleteBlogController,
    createPostController,
    getPostsByBlogId,
} from "./BlogControllers";
import { authMiddleware } from "../../middleware";
import {
    createPostValidationMiddleware,
    inputValidationMiddleware,
    queryValidationMiddleware,
    validateQuery,
    validateQueryByBlogs,
} from "./middlewares";

export const BlogsRouter = Router();

BlogsRouter.get("/", validateQueryByBlogs, getAllBlogsController);
BlogsRouter.get("/:id", queryValidationMiddleware, getBlogById);
BlogsRouter.get(
    "/:id/posts",
    queryValidationMiddleware,
    validateQuery,
    getPostsByBlogId,
);
BlogsRouter.post(
    "/",
    authMiddleware,
    inputValidationMiddleware,
    createBlogController,
);
BlogsRouter.post(
    "/:id/posts",
    authMiddleware,
    queryValidationMiddleware,
    createPostValidationMiddleware,
    createPostController,
);
BlogsRouter.put(
    "/:id",
    authMiddleware,
    queryValidationMiddleware,
    inputValidationMiddleware,
    updateBlogController,
);
BlogsRouter.delete(
    "/:id",
    authMiddleware,
    queryValidationMiddleware,
    deleteBlogController,
);
