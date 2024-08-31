import { Router } from "express";
import {
    getAllBlogsController,
    getBlogById,
    createBlogController,
    updateBlogController,
    deleteBlogController,
} from "./BlogControllers";
import { authMiddleware } from "../../middleware";
import {
    inputValidationMiddleware,
    queryValidationMiddleware,
} from "./middlewares";

export const BlogsRouter = Router();

BlogsRouter.get("/", getAllBlogsController);
BlogsRouter.get("/:id", queryValidationMiddleware, getBlogById);
BlogsRouter.post(
    "/",
    authMiddleware,
    inputValidationMiddleware,
    createBlogController,
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
