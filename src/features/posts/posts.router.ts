import { Router, NextFunction, Request, Response } from "express";
import { basicAuthMiddleware, bearerAuthMiddleware } from "../../middleware";
import { postsController } from "./posts.controller";
import {
    createQuerySchemaByPagination,
    queryValidationIdMiddleware,
    queryValidationMiddleware,
    validateBodyParams,
    validateQueryByPagination,
} from "../../utils";
import { postsQueryRepository } from "./repositories";
import { CreatePostSchema } from "./utils/validationSchemes";
import { UpdateCommentSchema } from "../comments/utils/validationSchemes";
import { blogsQueryRepository } from "../blogs/repositories/blogs.query-repository";

export const postsRouter = Router();

postsRouter.get(
    "/",
    validateQueryByPagination(createQuerySchemaByPagination({})),
    postsController.getAll,
);
postsRouter.get(
    "/:id",
    queryValidationIdMiddleware,
    queryValidationMiddleware(postsQueryRepository.findById),
    postsController.getById,
);
postsRouter.post(
    "/",
    basicAuthMiddleware,
    validateBodyParams(CreatePostSchema, blogsQueryRepository.find, "blogId"),
    postsController.create,
);
postsRouter.put(
    "/:id",
    basicAuthMiddleware,
    queryValidationIdMiddleware,
    queryValidationMiddleware(postsQueryRepository.findById),
    validateBodyParams(CreatePostSchema, blogsQueryRepository.find, "blogId"),
    postsController.update,
);
postsRouter.delete(
    "/:id",
    basicAuthMiddleware,
    queryValidationIdMiddleware,
    queryValidationMiddleware(postsQueryRepository.findById),
    postsController.delete,
);

postsRouter.get(
    "/:id/comments",
    queryValidationIdMiddleware,
    queryValidationMiddleware(postsQueryRepository.findById),
    validateQueryByPagination(createQuerySchemaByPagination({})),
    postsController.getComments,
);
postsRouter.post(
    "/:id/comments",
    bearerAuthMiddleware,
    queryValidationIdMiddleware,
    queryValidationMiddleware(postsQueryRepository.findById),
    validateBodyParams(UpdateCommentSchema),
    postsController.createComment,
);
